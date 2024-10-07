import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const projectApi = createApi({
  reducerPath: "projectApi",
  tagTypes: ["Project"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/" }),
  endpoints: (build) => ({


    getProjectNew: build.query({
      query: (userId = "") => ({
        url: `${userId}/projects/new`,
      }),
      transformResponse: (response) => {
        console.log(response); // Отладка ответа
        return {
          workers: response?.workers || [],
          strategies: response?.strategies || [],
          organizations: response?.organizations || [],
        };
      },
     
    }),

    postProject: build.mutation({
      query: ({ userId, ...body }) => ({
        url: `${userId}/projects/new`,
        method: "POST",
        body,
      }),
      
    })
  }),
});

export const { useGetProjectNewQuery, usePostProjectMutation } = projectApi;
