import type { Movie, TMDBMovieResponse } from "@/types/movie";
import { TMDB_IMAGE_BASE_URL } from "./TMDB.client";
import DefaultMoviePoster from "@/assets/img/default-movie-poster.svg?url";

export const mapTMDBMovie = (movie: TMDBMovieResponse): Movie => ({
  id: String(movie.id),
  title: movie.title,
  description: movie.overview,
  imageUrl: movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : DefaultMoviePoster,
});
