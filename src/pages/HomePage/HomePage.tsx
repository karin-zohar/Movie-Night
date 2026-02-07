import MovieDisplay from "@/components/MovieDisplay/MovieDisplay";
import { Typography } from "antd";
import './home-page.style.css';
import { useState } from "react";
import type { MovieFilter } from "@/types/movie";
import MovieFilters from "@/components/MovieFilters/MovieFilters";

const HomePage = () => {
  const { Title } = Typography;
  const [filter, setFilter] = useState<MovieFilter>({ category: 'popular' });

  return (
    <div className="home-page">
      <Title level={2}>{'What do you feel like watching?'}</Title>
      <MovieFilters setFilter={setFilter} />
      <MovieDisplay filter={filter} />
    </div>
  );
};

export default HomePage;
