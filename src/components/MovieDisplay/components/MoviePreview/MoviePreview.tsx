import type { FC } from "react";
import type { Movie } from "../../MovieDisplay.type";
import './movie-preview.style.css'
import { Typography } from "antd";

type MoviePreviewProps = {
  movie: Movie;
};

const MoviePreview: FC<MoviePreviewProps> = ({ movie }) => {
  const { Title } = Typography
  const { id, title, description, imageUrl } = movie
  return (
    <div className="movie-preview" key={id}>
      <div className="movie-preview-image-wrapper">
        <img src={imageUrl} alt={title} />
      </div>

      <div className="movie-preview-text-wrapper">
        <Title level={3}>{title}</Title>
        <span className="movie-preview-description">{description}</span>
      </div>

    </div>
  );
};

export default MoviePreview;