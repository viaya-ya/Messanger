import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const policyDirectoriesApi = createApi({
  reducerPath: "policyDirectoriesApi",
  tagTypes: ["policyDirectories"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/" }),
  endpoints: (build) => ({
    getPolicyDirectories: build.query({
      query: (userId = "") => ({
        url: `${userId}/policyDirectory`,
      }),
      transformResponse: (respone) => {
        console.log(respone);
        return {
          folders: respone || [],
        };
      },
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: "policyDirectories", id })),
              { type: "policyDirectories", id: "LIST" },
            ]
          : [{ type: "policyDirectories", id: "LIST" }],
    }),

    postPolicyDirectories: build.mutation({
      query: ({ userId = "", ...body }) => ({
        url: `${userId}/policyDirectory/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result) =>
        result ? [{ type: "policyDirectories" }] : [],
    }),

    updatePolicyDirectories: build.mutation({
      query: ({userId, policyDirectoryId , ...body}) => ({
        url: `${userId}/policyDirectory/${policyDirectoryId}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result,  error,  {policyDirectoryId}) => result ? [{type: "policyDirectories", id: policyDirectoryId}]: []
    }), 

    deletePolicyDirectories: build.mutation({
      query: ({userId, policyDirectoryId}) => ({
        url: `${userId}/policyDirectory/${policyDirectoryId}/remove`,
        method: "DELETE",
      }),
      invalidatesTags: (result,  error,  {policyDirectoryId}) => result ? [{type: "policyDirectories", id: policyDirectoryId}]: []
    }), 
  }),
});

export const {
  useGetPolicyDirectoriesQuery,
  usePostPolicyDirectoriesMutation,
  useDeletePolicyDirectoriesMutation,
  useUpdatePolicyDirectoriesMutation
} = policyDirectoriesApi;
