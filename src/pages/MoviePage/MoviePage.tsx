import { useQuery } from "@tanstack/react-query";
import type { Movie, TMDBMovieResponse } from "@/types/movie";
import { useParams } from "react-router";
import MovieDetails from "./components/MovieDetails/MovieDetails";
import MovieActions from "./components/MovieActions/MovieActions";
import { Flex } from "antd";
import { TMDBClient, TMDB_IMAGE_BASE_URL } from "@/api/TMDB.client";
import GenSpinner from "@/components/GenSpinner/GenSpinner";
import GenErrorMessage from "@/components/GenErrorMessage/GenErrorMessage";
import './movie-page.style.css';

const fetchMovie = async (movieId: string): Promise<Movie> => {
    const data = await TMDBClient.get<TMDBMovieResponse>(`/movie/${movieId}`);
    return {
        id: String(data.id),
        title: data.title,
        description: data.overview,
        imageUrl: data.poster_path
            ? `${TMDB_IMAGE_BASE_URL}${data.poster_path}`
            : "",
    };
};

const MoviePage = () => {
    const { id: movieId } = useParams();

    const { data: movie, isLoading, error } = useQuery({
        queryKey: ["movie", movieId],
        queryFn: () => fetchMovie(movieId!),
        enabled: !!movieId,
    });

    if (isLoading) return <GenSpinner />;
    if (error) return <GenErrorMessage error={error} />;

    return (
        <Flex className="movie-page">
            <MovieDetails movie={movie ?? null} />
            <MovieActions onSaveAsFavorite={() => {
                // TODO: implement save as favorite logic
                console.log("Saved as favorite:", movie?.id);
            }} />
        </Flex>
    );
};

export default MoviePage;