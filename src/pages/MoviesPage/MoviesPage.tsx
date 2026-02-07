import MovieDisplay from "@/components/MovieDisplay/MovieDisplay";
import { Typography } from "antd";
import './movies-page.style.css';
import { useState, type FC } from "react";
import type { MovieFilter } from "@/types/movie";
import MovieFilters from "@/components/MovieFilters/MovieFilters";
import { useFavorites } from "@/store";

const { Title } = Typography;

type MoviesPageProps = {
  initialCategory?: MovieFilter["category"];
};

const MoviesPage: FC<MoviesPageProps> = ({ initialCategory = 'popular' }) => {
  const [filter, setFilter] = useState<MovieFilter>({ category: initialCategory });
  const { favoriteIds } = useFavorites();
  const isFavoritesView = initialCategory === 'my_favorites';
  const isFavoritesEmpty = isFavoritesView && favoriteIds.length === 0;

  return (
    <div className="movies-page">
      <Title level={2}>{isFavoritesView ? 'Your Favorites' : 'What do you feel like watching?'}</Title>
      {!isFavoritesView && <MovieFilters setFilter={setFilter} initialCategory={initialCategory} />}
      {isFavoritesEmpty
        ? <span className="empty-favorites-message">Nothing here yet! Browse and save your favorite movies.</span>
        : <MovieDisplay filter={filter} />
      }
    </div>
  );
};

export default MoviesPage;
