export type Movie = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

export type MovieFilter =
 {
  category?: "popular" | "now_playing";
  search?: string;
 }

export interface TMDBMovieResponse {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
}

export interface TMDBMovieListResponse {
  page: number;
  results: TMDBMovieResponse[];
  total_pages: number;
  total_results: number;
}
