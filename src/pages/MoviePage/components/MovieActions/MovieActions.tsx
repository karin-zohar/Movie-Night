import type { FC } from "react";
import { Button } from "antd";
import './movie-actions.style.css';
import { HeartFilledIcon, HeartOutlinedIcon } from "@/libs/ui/icons";

type MovieActionsProps = {
  onToggleFavorite: () => void;
  isFavorite?: boolean;
};

const MovieActions: FC<MovieActionsProps> = ({ onToggleFavorite, isFavorite }) => {

  return (
    <div className="movie-actions">
      <Button
        className="custom-button toggle-favorite-button"
        variant="outlined"
        icon={isFavorite ? <HeartFilledIcon /> : <HeartOutlinedIcon />}
        onClick={onToggleFavorite}
      >
        {isFavorite ? "Remove from Favorites" : "Save as Favorite"}
      </Button>
    </div>
  );
};

export default MovieActions;
