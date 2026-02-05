import type { FC } from "react";
import { Button } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import './movie-actions.style.css';

type MovieActionsProps = {
  onSaveAsFavorite: () => void;
};

const MovieActions: FC<MovieActionsProps> = ({ onSaveAsFavorite }) => {
  return (
    <div className="movie-actions">
      <Button
        className="custom-button"
        variant="outlined"
        icon={<HeartOutlined />}
        onClick={onSaveAsFavorite}
      >
        Save as Favorite
      </Button>
    </div>
  );
};

export default MovieActions;
