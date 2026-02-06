import MovieDisplay from "@/components/MovieDisplay/MovieDisplay";
import { Typography } from "antd";
import './home-page.style.css';

const HomePage = () => {
  const { Title } = Typography;

  return (
    <div className="home-page">
      <Title level={2}>{'What do you feel like watching?'}</Title>
      <MovieDisplay />
    </div>
  );
};

export default HomePage;
