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
      providesTags: [{ type: "policyDirectories", id: "LIST" }],
    }),

    postPolicyDirectories: build.mutation({
      query: ({ userId = "", ...body }) => ({
        url: `${userId}/policyDirectory/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result) =>
        result ? [{ type: "policyDirectories", id: "LIST"  }] : [],
    }),

    updatePolicyDirectories: build.mutation({
      query: ({userId, policyDirectoryId , ...body}) => ({
        url: `${userId}/policyDirectory/${policyDirectoryId}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result) => result ?  [{ type: "policyDirectories", id: "LIST" }]: []
    }), 

    deletePolicyDirectories: build.mutation({
      query: ({userId, policyDirectoryId}) => ({
        url: `${userId}/policyDirectory/${policyDirectoryId}/remove`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "policyDirectories", id: "LIST"  }],
    }), 
  }),
});

export const {
  useGetPolicyDirectoriesQuery,
  usePostPolicyDirectoriesMutation,
  useDeletePolicyDirectoriesMutation,
  useUpdatePolicyDirectoriesMutation
} = policyDirectoriesApi;
