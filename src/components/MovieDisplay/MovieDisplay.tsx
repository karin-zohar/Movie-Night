import type { FC } from "react";
import type { Movie } from "./MovieDisplay.type";
import MovieList from "./components/MovieList/MovieList";

type MovieDisplayProps = {
  movies: Movie[];
};

//TODO: handle async & pagination here 
const MovieDisplay: FC<MovieDisplayProps> = ({ movies }) => {
  return (
    <div className="movie-display">
      <MovieList movies={movies} />
    </div>
  );
};

export default MovieDisplay;