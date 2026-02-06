import { useEffect, useState } from "react";
import type { Movie, TMDBMovieListResponse } from "../../types/movie";
import { TMDBClient } from "@/api/TMDB.client";
import MovieList from "./components/MovieList/MovieList";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";


const MovieDisplay = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    async function fetchMovies() {
      const [page1] = await Promise.all([
        TMDBClient.get<TMDBMovieListResponse>("/movie/popular?page=1"),
      ]);

      const allMovies = [...page1.results]
        .map((movie) => ({
          id: String(movie.id),
          title: movie.title,
          description: movie.overview,
          imageUrl: movie.poster_path
            ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
            : "",
        }));

      setMovies(allMovies);
    }

    fetchMovies();
  }, []);

  return (
    <div className="movie-display">
      <MovieList movies={movies} />
    </div>
  );
};

export default MovieDisplay;