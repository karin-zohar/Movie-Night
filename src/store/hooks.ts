import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { setTheme, type Theme } from "./theme";
import { useCallback } from "react";

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
