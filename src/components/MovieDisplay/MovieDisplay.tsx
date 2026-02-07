import { useQuery } from "@tanstack/react-query";
import type { Movie, MovieFilter, TMDBMovieListResponse, TMDBMovieResponse } from "@/types/movie";
import { TMDBClient, mapTMDBMovie } from "@/api/TMDB";
import { useFavorites } from "@/store";
import GenSpinner from "@/libs/ui/components/GenSpinner/GenSpinner";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import MovieList from "./components/MovieList/MovieList";

const getMovieListEndpoint = (filter: MovieFilter): string => {
  if (filter.search && filter.search.trim().length >= 2) {
    return `/search/movie?page=1&query=${encodeURIComponent(filter.search)}`;
  }
  return `/movie/${filter.category ?? 'popular'}?page=1`;
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

const fetchMovies = async (filter: MovieFilter): Promise<Movie[]> => {
  const endpoint = getMovieListEndpoint(filter);
  const data = await TMDBClient.get<TMDBMovieListResponse>(endpoint);
  return data.results.map(mapTMDBMovie);
};

interface MovieDisplayProps {
  filter?: MovieFilter;
}

const MovieDisplay = ({ filter = { category: "popular" } }: MovieDisplayProps) => {
  const { favoriteIds } = useFavorites();
  const isFavoritesView = filter.category === "my_favorites";

  const { data: movies, isLoading, error } = useQuery({
    queryKey: isFavoritesView ? ["movies", "favorites", favoriteIds] : ["movies", filter],
    queryFn: () =>
      isFavoritesView
        ? fetchFavoriteMovies(favoriteIds)
        : fetchMovies(filter),
  });

  if (isLoading) { return <GenSpinner /> };
  if (error) { return <ErrorMessage error={error} /> };

  return (
    <div className="movie-display">
      <MovieList movies={movies ?? []} />
    </div>
  );
};

export default MovieDisplay;