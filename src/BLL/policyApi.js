import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {url} from "./baseUrl"

export const policyApi = createApi({
  reducerPath: "policyApi",
  tagTypes: ["Policy"],
  baseQuery: fetchBaseQuery({ baseUrl: url }),
  endpoints: (build) => ({
    getPolicies: build.query({
      query: (userId = "") => ({
        url: `${userId}/policies`,
      }),

      transformResponse: (response) => {
        const directivesActive = response.directives
          .filter((item) => item.state === "Активный")
          .sort((a, b) => a.policyName.localeCompare(b.policyName));

        const directivesDraft = response.directives
          .filter((item) => item.state === "Черновик")
          .sort((a, b) => a.policyName.localeCompare(b.policyName));

        const directivesCompleted = response.directives
          .filter((item) => item.state === "Отменён")
          .sort((a, b) => a.policyName.localeCompare(b.policyName));

        const instructionsActive = response.instructions
          .filter((item) => item.state === "Активный")
          .sort((a, b) => a.policyName.localeCompare(b.policyName));

        const instructionsDraft = response.instructions
          .filter((item) => item.state === "Черновик")
          .sort((a, b) => a.policyName.localeCompare(b.policyName));

        const instructionsCompleted = response.instructions
          .filter((item) => item.state === "Отменён")
          .sort((a, b) => a.policyName.localeCompare(b.policyName));

        return {
          directives: response.directives || [],
          instructions: response.instructions || [],

          directivesActive: directivesActive || [],
          directivesDraft: directivesDraft || [],
          directivesCompleted: directivesCompleted || [],

          instructionsActive: instructionsActive || [],
          instructionsDraft: instructionsDraft || [],
          instructionsCompleted: instructionsCompleted || [],
        };
      },

      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: "Policy", id })),
              { type: "Policy", id: "LIST" },
            ]
          : [{ type: "Policy", id: "LIST" }],
    }),

    postPolicies: build.mutation({
      query: ({ userId, ...body }) => ({
        url: `${userId}/policies/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Policy", id: "LIST" }],
    }),

    getPoliciesNew: build.query({
      query: (userId = "") => ({
        url: `${userId}/policies/new`,
      }),
      transformResponse: (response) => ({
        organizations: response.organizations || [],
      }),
    }),

    getPoliciesId: build.query({
      query: ({ userId, policyId }) => ({
        url: `${userId}/policies/${policyId}`,
      }),
      transformResponse: (response) => {
        console.log(response); // Отладка ответа
        return {
          currentPolicy: response.currentPolicy || {},
          organizations: response.organizations || [],
        };
      },
      // Добавляем теги для этой query
      providesTags: (result, error, { policyId }) =>
        result ? [{ type: "Policy", id: policyId }] : [],
    }),

    updatePolicies: build.mutation({
      query: ({ userId, policyId, ...body }) => ({
        url: `${userId}/policies/${policyId}/update`,
        method: "PATCH",
        body,
      }),
      // Обновляем теги, чтобы перезагрузить getPoliciesId
      invalidatesTags: (result, error, { policyId }) => [
        { type: "Policy", id: policyId },
      ],
    }),

    postImage: build.mutation({
      query: ({ userId, policyId, formData }) => ({
        url: `${userId}/file-upload/upload?policyId=${policyId}`,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetPoliciesQuery,
  usePostPoliciesMutation,
  useGetPoliciesNewQuery,
  useGetPoliciesIdQuery,
  useUpdatePoliciesMutation,
  usePostImageMutation,
} = policyApi;
