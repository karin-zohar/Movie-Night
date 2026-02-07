import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { setTheme, type Theme } from "./theme";
import { addFavorite, removeFavorite } from "./favorites";
import { useCallback, useMemo } from "react";

export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export const useTheme = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  const dispatch = useAppDispatch();

  const changeTheme = useCallback(
    (newTheme: Theme) => {
      dispatch(setTheme(newTheme));
    },
    [dispatch]
  );

  return { theme, setTheme: changeTheme } as const;
};

export const useFavorites = () => {
  const movieIds = useAppSelector((state) => state.favorites.movieIds);
  const dispatch = useAppDispatch();

  const add = useCallback(
    (movieId: string) => {
      dispatch(addFavorite(movieId));
    },
    [dispatch]
  );

  const remove = useCallback(
    (movieId: string) => {
      dispatch(removeFavorite(movieId));
    },
    [dispatch]
  );

  const isFavorite = useCallback(
    (movieId: string) => !!movieIds[movieId],
    [movieIds]
  );

  const favoriteIdList = useMemo(
    () => Object.keys(movieIds),
    [movieIds]
  );

  return {
    favoriteIds: favoriteIdList,
    addFavorite: add,
    removeFavorite: remove,
    isFavorite,
  } as const;
};
