import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const policyApi = createApi({
  reducerPath: "policyApi",
  tagTypes: ["Policy"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/" }),
  endpoints: (build) => ({
    getPolicies: build.query({
      query: (userId = "") => ({
        url: `${userId}/policies`,
      }),

      transformResponse: (response) => ({
        directives: response.directives || [],
        instructions: response.instructions || [],
      }),

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
  }),
});

export const {
  useGetPoliciesQuery,
  usePostPoliciesMutation,
  useGetPoliciesNewQuery,
  useGetPoliciesIdQuery,
  useUpdatePoliciesMutation,
} = policyApi;
