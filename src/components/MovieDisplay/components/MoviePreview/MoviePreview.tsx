import { memo, useCallback, useRef, type FC } from "react";
import type { Movie } from "@/types/movie";
import { Link } from "react-router";
import { Typography } from "antd";
import { useKeyboardNavigation } from "@/providers/KeyboardNavigation";
import './movie-preview.style.css';

const { Title } = Typography;

type MoviePreviewProps = {
  movie: Movie;
};

const MoviePreview: FC<MoviePreviewProps> = ({ movie }) => {
  const { id, title, description, imageUrl } = movie;
  const { register, unregister } = useKeyboardNavigation();
  const registeredRef = useRef<HTMLAnchorElement | null>(null);

  const linkRef = useCallback((el: HTMLAnchorElement | null) => {
    const prev = registeredRef.current;
    if (prev && prev !== el) {
      unregister(prev);
    }
    registeredRef.current = el;
    register(el);
  }, [register, unregister]);

  return (
    <Link to={`/movie/${id}`} className="movie-preview-link" ref={linkRef}>
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

export default memo(MoviePreview);
