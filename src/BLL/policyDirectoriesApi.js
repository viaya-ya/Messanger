import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {url} from "./baseUrl"
import {prepareHeaders} from "./Function/prepareHeaders.js"

export const policyDirectoriesApi = createApi({
  reducerPath: "policyDirectoriesApi",
  tagTypes: ["policyDirectories"],
  baseQuery: fetchBaseQuery({ baseUrl: url, prepareHeaders }),
  endpoints: (build) => ({
    getPolicyDirectories: build.query({
      query: (userId = "") => ({
        url: `${userId}/policyDirectory`,
      }),
      transformResponse: (response) => {
        console.log(response);

        const foldersSort = response
        ?.map((element) => ({
          ...element,
          policyToPolicyDirectories: element.policyToPolicyDirectories
          ?.sort((a, b) =>
            a?.policy?.policyName.localeCompare(b?.policy?.policyName)
          )
          ?.sort((a, b) => {
              if (a?.policy?.type === "Директива" && b?.policy?.type !== "Директива") {
                return -1; 
              }
              if (a?.policy?.type !== "Директива" && b?.policy?.type === "Директива") {
                return 1;
              }
              return 0; 
            }), 
        }));
         

        return {
          folders: response || [],
          foldersSort: foldersSort,
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
        result ? [{ type: "policyDirectories", id: "LIST" }] : [],
    }),

    updatePolicyDirectories: build.mutation({
      query: ({ userId, policyDirectoryId, ...body }) => ({
        url: `${userId}/policyDirectory/${policyDirectoryId}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result) =>
        result ? [{ type: "policyDirectories", id: "LIST" }] : [],
    }),

    deletePolicyDirectories: build.mutation({
      query: ({ userId, policyDirectoryId }) => ({
        url: `${userId}/policyDirectory/${policyDirectoryId}/remove`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "policyDirectories", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPolicyDirectoriesQuery,
  usePostPolicyDirectoriesMutation,
  useDeletePolicyDirectoriesMutation,
  useUpdatePolicyDirectoriesMutation,
} = policyDirectoriesApi;
