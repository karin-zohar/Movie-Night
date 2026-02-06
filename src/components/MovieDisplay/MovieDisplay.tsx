import { useQuery } from "@tanstack/react-query";
import type { Movie, TMDBMovieListResponse } from "../../types/movie";
import { TMDBClient, TMDB_IMAGE_BASE_URL } from "@/api/TMDB.client";
import GenSpinner from "@/components/GenSpinner/GenSpinner";
import GenErrorMessage from "@/components/GenErrorMessage/GenErrorMessage";
import MovieList from "./components/MovieList/MovieList";

const fetchMovies = async (): Promise<Movie[]> => {
  const data = await TMDBClient.get<TMDBMovieListResponse>("/discover/movie?page=1");

  return data.results.map((movie) => ({
    id: String(movie.id),
    title: movie.title,
    description: movie.overview,
    imageUrl: movie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
      : "",
  }));
};

const MovieDisplay = () => {
  const { data: movies, isLoading, error } = useQuery({
    queryKey: ["movies"],
    queryFn: fetchMovies,
  });

  if (isLoading) return <GenSpinner />;
  if (error) return <GenErrorMessage error={error} />;

  return (
    <div className="movie-display">
      <MovieList movies={movies ?? []} />
    </div>
  );
};

export default MovieDisplay;