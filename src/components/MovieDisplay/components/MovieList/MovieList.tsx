import type { FC } from "react";
import type { Movie } from "../../../../types/movie";
import MoviePreview from "../MoviePreview/MoviePreview";
import './movie-list.style.css';

type MovieListProps = {
  movies: Movie[];
};

const MovieList: FC<MovieListProps> = ({ movies }) => {
  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MoviePreview key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieList;