import type { FC } from "react";
import type { Movie } from "@/types/movie";
import { Link } from "react-router";
import { Typography } from "antd";
import './movie-preview.style.css';

type MoviePreviewProps = {
  movie: Movie;
};

const MoviePreview: FC<MoviePreviewProps> = ({ movie }) => {
  const { Title } = Typography;
  const { id, title, description, imageUrl } = movie;

  return (
    <Link to={`/movie/${id}`} className="movie-preview-link">
      <div className="movie-preview">
        <div className="movie-preview-image-wrapper">
          <img src={imageUrl} alt={title} />
        </div>

        <div className="movie-preview-text-wrapper">
          <Title level={3}>{title}</Title>
          <span className="movie-preview-description">{description}</span>
        </div>
      </div>
    </Link>
  );
};

export default MoviePreview;
