export interface Episode {
  id: number;
  episode_number: number;
  title: string;
  overview: string;
  duration: string;
  still_path: string;
  videoUrl?: string;
}

export interface Season {
  season_number: number;
  title: string;
  episodes: Episode[];
}

export interface Review {
  id: string;
  movieId: number;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  name?: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  media_type: "movie" | "tv";
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  popularity?: number;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count?: number;
  trailerKey?: string;
  videoUrl?: string;
  maturity_rating?: string;
  duration?: string;
  cast?: string[];
  isKids?: boolean;
  seasons?: Season[];
  reviews?: Review[];
}

export interface CategoryRow {
  title: string;
  movies: Movie[];
}
