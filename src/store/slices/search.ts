import { TMDB_V3_API_KEY } from "src/constant";
import { tmdbApi } from "./apiSlice";
import { MEDIA_TYPE, PaginatedMovieResult } from "src/types/Common";
import { createSlice, isAnyOf } from "@reduxjs/toolkit";

const initialState: Record<string, PaginatedMovieResult> = {};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setNextPage: (state, action) => {
      const { searchTerm } = action.payload;
      state[searchTerm].page += 1;
    },
    initiateSearch: (state, action) => {
      const { searchTerm } = action.payload;
      if (!state[searchTerm]) {
        state[searchTerm] = {
          page: 0,
          results: [],
          total_pages: 0,
          total_results: 0,
        };
      }
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      extendedApi.endpoints.searchVideos.matchFulfilled,
      (state, action) => {
        const {
          page,
          results,
          total_pages,
          total_results,
          searchTerm,
        } = action.payload;
        state[searchTerm].page = page;
        state[searchTerm].results.push(...results);
        state[searchTerm].total_pages = total_pages;
        state[searchTerm].total_results = total_results;
      }
    );
  },
});

export const { setNextPage, initiateSearch } = searchSlice.actions;
export default searchSlice.reducer;

const extendedApi = tmdbApi.injectEndpoints({
  endpoints: (build) => ({
    searchVideos: build.query<
      PaginatedMovieResult & {
        searchTerm: string;
      },
      { mediaType: MEDIA_TYPE; searchTerm: string; page: number }
    >({
      query: ({ mediaType, searchTerm, page }) => ({
        url: `/search/${mediaType}`,
        params: { api_key: TMDB_V3_API_KEY, query: searchTerm, page },
      }),
      transformResponse: (
        response: PaginatedMovieResult,
        _,
        { searchTerm }
      ) => ({
        ...response,
        searchTerm,
      }),
    }),
  }),
});

export const {
  useSearchVideosQuery,
  useLazySearchVideosQuery,
} = extendedApi;