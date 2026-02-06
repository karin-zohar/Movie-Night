import { useEffect, useState } from "react";
import type { Movie, TMDBMovieResponse } from "@/types/movie";
import { useParams } from "react-router";
import MovieDetails from "./components/MovieDetails/MovieDetails";
import MovieActions from "./components/MovieActions/MovieActions";
import { Flex } from "antd";
import { TMDBClient } from "@/api/TMDB.client";
import './movie-page.style.css';

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MoviePage = () => {
    const { id: movieId } = useParams();
    const [movie, setMovie] = useState<Movie | null>(null);

    useEffect(() => {
        if (!movieId) return;

        TMDBClient.get<TMDBMovieResponse>(`/movie/${movieId}`).then((data) => {
            setMovie({
                id: String(data.id),
                title: data.title,
                description: data.overview,
                imageUrl: data.poster_path
                    ? `${TMDB_IMAGE_BASE_URL}${data.poster_path}`
                    : "",
            });
        });
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