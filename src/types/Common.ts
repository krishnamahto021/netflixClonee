import { Movie } from "src/types/Movie";

export enum MEDIA_TYPE {
  Movie = "movie",
  Tv = "tv",
}

export interface Company {
  description: string;
  headquarters: string;
  homepage: string;
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
  parent_company: null | object;
}

export interface Country {
  iso_3166_1: string;
  english_name: string;
}

export interface Language {
  iso_639_1: string;
  english_name: string;
  name: string;
}

export interface PaginatedResult {
  page: number;
  total_pages: number;
  total_results: number;
}

export interface PaginatedMovieResult extends PaginatedResult {
  results: Movie[];
}
