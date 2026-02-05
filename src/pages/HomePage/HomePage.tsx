import MovieDisplay from "@/components/MovieDisplay/MovieDisplay";
import { Typography } from "antd";
import './home-page.style.css';
const staticMovies = Array.from({ length: 20 }, (_, index) => ({
  id: index.toString(),
  title: `The Dark Knight`,
  description: `Description of Movie ${index + 1}, a very long description of the movie that is longer than the text container`,
  imageUrl: `https://plus.unsplash.com/premium_photo-1710409625244-e9ed7e98f67b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
}));

const HomePage = () => {

  const { Title } = Typography;
  return (
    <div className="home-page">
      <Title level={2}>{'What do you feel like watching?'}</Title>
      <MovieDisplay movies={staticMovies} />
    </div>
  );
};

export default HomePage;
