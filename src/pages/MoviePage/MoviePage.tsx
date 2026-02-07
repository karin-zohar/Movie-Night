import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { TMDBClient, mapTMDBMovie } from "@/api/TMDB";
import MovieDetails from "./components/MovieDetails/MovieDetails";
import MovieActions from "./components/MovieActions/MovieActions";
import type { Movie, TMDBMovieResponse } from "@/types/movie";
import GenSpinner from "@/libs/ui/components/GenSpinner/GenSpinner";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import { Flex } from "antd";
import './movie-page.style.css';
import { useFavorites } from "@/store";

const fetchMovie = async (movieId: string): Promise<Movie> => {
    const data = await TMDBClient.get<TMDBMovieResponse>(`/movie/${movieId}`);
    return mapTMDBMovie(data);
};

const MoviePage = () => {
    const { id: movieId } = useParams();
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();

    const handleToggleFavorite = useCallback(() => {
        if (!movieId) { return };
        if (isFavorite(movieId)) {
            removeFavorite(movieId);
        } else {
            addFavorite(movieId);
        }
    }, [movieId, isFavorite, addFavorite, removeFavorite]);

    const { data: movie, isLoading, error } = useQuery({
        queryKey: ["movie", movieId],
        queryFn: () => {
            if (!movieId) {
                throw new Error("Missing movie ID")
            };
            return fetchMovie(movieId);
        },
        enabled: !!movieId,
    });

    if (isLoading) { return <GenSpinner /> };
    if (error) { return <ErrorMessage error={error} /> };

    return (
        <Flex className="movie-page">
            <MovieDetails movie={movie ?? null} />
            <MovieActions onToggleFavorite={handleToggleFavorite} isFavorite={movieId ? isFavorite(movieId) : false} />
        </Flex>
    );
};

export default MoviePage;