import type { Movie, TMDBMovieResponse } from "@/types/movie";
import DefaultMoviePoster from "@/assets/img/default-movie-poster.svg?url";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";


export const mapTMDBMovie = (movie: TMDBMovieResponse): Movie => {
  if (movie.id == null) {
    throw new Error(
      `Invalid TMDB response: missing required field (id: ${movie.id})`
    );
  }

  return {
    id: String(movie.id),
    title: movie.title ?? "",
    description: movie.overview ?? "",
    imageUrl: movie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
      : DefaultMoviePoster,
  };
};
