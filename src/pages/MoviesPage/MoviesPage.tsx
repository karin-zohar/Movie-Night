import MovieDisplay from "@/components/MovieDisplay/MovieDisplay";
import { Typography } from "antd";
import './movies-page.style.css';
import { useState, type FC } from "react";
import type { MovieFilter } from "@/types/movie";
import MovieFilters from "@/components/MovieFilters/MovieFilters";

type MoviesPageProps = {
  initialCategory?: MovieFilter["category"];
};

const MoviesPage: FC<MoviesPageProps> = ({ initialCategory = 'popular' }) => {
  const { Title } = Typography;
  const [filter, setFilter] = useState<MovieFilter>({ category: initialCategory });

  return (
    <div className="movies-page">
      <Title level={2}>{'What do you feel like watching?'}</Title>
      {initialCategory !== 'my_favorites' && <MovieFilters setFilter={setFilter} initialCategory={initialCategory} />}
      <MovieDisplay filter={filter} />
    </div>
  );
};

export default MoviesPage;
