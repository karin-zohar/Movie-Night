import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { Movie, MovieFilter, TMDBMovieListResponse, TMDBMovieResponse } from "@/types/movie";
import { TMDBClient, mapTMDBMovie } from "@/api/TMDB";
import { useFavorites } from "@/store";
import GenSpinner from "@/libs/ui/components/GenSpinner/GenSpinner";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import MovieList from "./components/MovieList/MovieList";
import { useCallback, useEffect, useRef } from "react";
import { useKeyboardNavigation } from "@/providers/KeyboardNavigation";

const getMovieListEndpoint = (filter: MovieFilter, page: number): string => {
  if (filter.search && filter.search.trim().length >= 2) {
    return `/search/movie?page=${page}&query=${encodeURIComponent(filter.search)}`;
  }
  return `/movie/${filter.category ?? 'popular'}?page=${page}`;
};

const fetchFavoriteMovies = async (favoriteMovieIds: string[]): Promise<Movie[]> => {
  if (favoriteMovieIds.length === 0) return [];

  const results = await Promise.allSettled(
    favoriteMovieIds.map((id) => TMDBClient.get<TMDBMovieResponse>(`/movie/${id}`))
  );

  return results
    .filter((result) => result.status === "fulfilled")
    .map((result) => mapTMDBMovie(result.value));
};

type MoviePageResult = { results: Movie[]; page: number; total_pages: number };

const fetchMovies = async (filter: MovieFilter, pageParam: number): Promise<MoviePageResult> => {
  const endpoint = getMovieListEndpoint(filter, pageParam);
  const data = await TMDBClient.get<TMDBMovieListResponse>(endpoint);
  return {
    results: data.results.map(mapTMDBMovie),
    page: data.page,
    total_pages: data.total_pages,
  };
};

interface MovieDisplayProps {
  filter?: MovieFilter;
}

function getScrollParent(el: Element | null): Element | null {
  if (!el) return null;
  let parent = el.parentElement;
  while (parent) {
    const { overflowY } = getComputedStyle(parent);
    if (/(auto|scroll|overlay)/.test(overflowY) && parent.scrollHeight > parent.clientHeight) return parent;
    parent = parent.parentElement;
  }
  return null;
}

const MovieDisplay = ({ filter = { category: "popular" } }: MovieDisplayProps) => {
  const { favoriteIds } = useFavorites();
  const isFavoritesView = filter.category === "my_favorites";
  const { isLocked } = useKeyboardNavigation();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const fetchNextPageRef = useRef<() => void>(() => { });
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const moviesQuery = useInfiniteQuery({
    queryKey: ["movies", filter],
    queryFn: ({ pageParam }) => fetchMovies(filter, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !isFavoritesView,
  });

  const favoritesQuery = useQuery({
    queryKey: ["movies", "favorites", favoriteIds],
    queryFn: () => fetchFavoriteMovies(favoriteIds),
    enabled: isFavoritesView,
  });

  const activeQuery = isFavoritesView ? favoritesQuery : moviesQuery;
  const { isLoading, error } = activeQuery;

  const movies = isFavoritesView
    ? (favoritesQuery.data ?? [])
    : (moviesQuery.data?.pages.flatMap((p) => p.results) ?? []);

  fetchNextPageRef.current = moviesQuery.fetchNextPage;

  const sentinelRef = useCallback(
    (el: HTMLDivElement | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      if (isFavoritesView || !moviesQuery.hasNextPage || el == null) { return };

      const root = getScrollParent(el);
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) { fetchNextPageRef.current() };
        },
        { root: root ?? undefined, rootMargin: "200px", threshold: 0 }
      );
      observerRef.current.observe(el);
    },
    [isFavoritesView, moviesQuery.hasNextPage]
  );

  // Prevent mouse wheel and drag scroll on the scrollable container when keyboard nav is active
  useEffect(() => {
    const scrollRoot = getScrollParent(scrollContainerRef.current);
    if (!scrollRoot) return;

    const preventWheel = (e: Event) => {
      if (!isLocked()) {
        e.preventDefault();
      }
    };
    scrollRoot.addEventListener("wheel", preventWheel, { passive: false });
    return () => scrollRoot.removeEventListener("wheel", preventWheel);
  }, [isLocked]);

  if (isLoading) { return <GenSpinner /> };
  if (error) { return <ErrorMessage error={error} /> };

  return (
    <div ref={scrollContainerRef}>
      <MovieList movies={movies} />
      {!isFavoritesView && (
        <>
          <div ref={sentinelRef} aria-hidden style={{ minHeight: 1, height: 1, display: "block" }} />
          {moviesQuery.isFetchingNextPage && <GenSpinner />}
        </>
      )}
    </div>
  );
};

export default MovieDisplay;