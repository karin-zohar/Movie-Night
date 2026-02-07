import type { FC } from "react";
import { Button } from "antd";
import './movie-actions.style.css';
import { HeartFilledIcon, HeartOutlinedIcon } from "@/libs/ui/icons";
import { KeyboardNavigable } from "@/providers/KeyboardNavigation";

type MovieActionsProps = {
  onToggleFavorite: () => void;
  isFavorite?: boolean;
};

const MovieActions: FC<MovieActionsProps> = ({ onToggleFavorite, isFavorite }) => {

  return (
    <div className="movie-actions">
      <KeyboardNavigable onActivate={onToggleFavorite}>
        <Button
          className="custom-button toggle-favorite-button"
          variant="outlined"
          icon={isFavorite ? <HeartFilledIcon /> : <HeartOutlinedIcon />}
          onClick={onToggleFavorite}
        >
          {isFavorite ? "Remove from Favorites" : "Save as Favorite"}
        </Button>
      </KeyboardNavigable>
    </div>
  );
};

export default MovieActions;
