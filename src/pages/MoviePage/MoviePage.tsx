import type { Movie } from "@/types/movie";
import { useMemo, type FC } from "react";
import { useParams } from "react-router";
import MovieDetails from "./components/MovieDetails/MovieDetails";
import MovieActions from "./components/MovieActions/MovieActions";
import { Flex } from "antd";
import './movie-page.style.css';

type MoviePageProps = {

};

const MoviePage: FC<MoviePageProps> = ({ }) => {
    const params = useParams();
    const movieId = params.id

    const movie: Movie | null = useMemo(() => {
        // TODO: GET movie from API / Local storage 
        if (!movieId) {
            return null;
        }
        return {
            id: movieId,
            title: "The Dark Knight",
            description: "A movie about a dark knight",
            imageUrl: "https://plus.unsplash.com/premium_photo-1710409625244-e9ed7e98f67b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        };
    }, [movieId]);

    return (
        <Flex className="movie-page">
            <MovieDetails movie={movie} />
            <MovieActions onSaveAsFavorite={() => {
                // TODO: implement save as favorite logic
                console.log("Saved as favorite:", movie?.id);
            }} />
        </Flex>
    );
};

export default MoviePage;