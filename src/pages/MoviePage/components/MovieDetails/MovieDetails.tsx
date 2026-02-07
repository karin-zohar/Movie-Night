import type { FC } from "react";
import type { Movie } from "@/types/movie";
import { Typography } from "antd";
import './movie-details.style.css';

type MovieDetailsProps = {
  movie: Movie | null;
};

const MovieDetails: FC<MovieDetailsProps> = ({ movie }) => {
  const { Title } = Typography;

  if (!movie) {
    return <div className="movie-details">Movie not found.</div>;
  }

  const { title, description, imageUrl } = movie;

  return (
    <div className="movie-details">
      <div className="movie-details-image-wrapper">
        <img src={imageUrl} alt={title} />
      </div>

      <div className="movie-details-text-wrapper">
        <Title level={2}>{title}</Title>
        <span>{description}</span>
      </div>
    </div>
  );
};

export default MovieDetails;
