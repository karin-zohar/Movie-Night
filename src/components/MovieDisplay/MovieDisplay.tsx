import { useQuery } from "@tanstack/react-query";
import type { Movie, MovieFilter, TMDBMovieListResponse } from "@/types/movie";
import { TMDBClient, TMDB_IMAGE_BASE_URL } from "@/api/TMDB.client";
import GenSpinner from "@/libs/ui/components/GenSpinner/GenSpinner";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import MovieList from "./components/MovieList/MovieList";
import DefaultMoviePoster from "@/assets/img/default-movie-poster.jpg";

const getMovieEndpoint = (filter: MovieFilter): string => {
  if (filter.search && filter.search.trim().length >= 2) {
    return `/search/movie?page=1&query=${encodeURIComponent(filter.search)}`;
  }
  return `/movie/${filter.category ?? 'popular'}?page=1`;

};

const fetchMovies = async (filter: MovieFilter): Promise<Movie[]> => {
  const endpoint = getMovieEndpoint(filter);
  const data = await TMDBClient.get<TMDBMovieListResponse>(endpoint);

  return data.results.map((movie) => ({
    id: String(movie.id),
    title: movie.title,
    description: movie.overview,
    imageUrl: movie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
      : DefaultMoviePoster,
  }));
};

interface MovieDisplayProps {
  filter?: MovieFilter;
}

const MovieDisplay = ({ filter = { category: "popular" } }: MovieDisplayProps) => {
  const { data: movies, isLoading, error } = useQuery({
    queryKey: ["movies", filter],
    queryFn: () => fetchMovies(filter),
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