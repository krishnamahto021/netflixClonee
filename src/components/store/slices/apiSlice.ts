import { API_ENDPOINT_URL } from "../../constant/index";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_ENDPOINT_URL }),
  endpoints: (build) => ({}),
});
