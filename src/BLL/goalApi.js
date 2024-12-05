import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {url} from "./baseUrl"

export const goalApi = createApi({
  reducerPath: "goalApi",
  tagTypes: ["Goal"],
  baseQuery: fetchBaseQuery({ baseUrl: url }),
  endpoints: (build) => ({
    getGoal: build.query({
      query: (userId = "") => ({
        url: `${userId}/goals`,
      }),
      transformResponse: (response) => ({
        organizationsWithGoal: response?.organizationsWithGoal || [],
        organizationsWithoutGoal: response?.organizationsWithoutGoal || [],
        goals: response?.organizationsWithGoal?.flatMap(org => org.goal) || []
      }),
      providesTags: (result) =>
        result && Array.isArray(result.organizations)
          ? [
              ...result.organizations.map(({ id }) => ({ type: "Goal", id })),
              { type: "Goal", id: "LIST" },
            ]
          : [{ type: "Goal", id: "LIST" }],
    }),
    getGoalNew: build.query({
      query: (userId = "") => ({
        url: `${userId}/goals/new`,
      }),
      transformResponse: (response) => ({
        organizations: response || [],
      }),
    }),
    getGoalId: build.query({
      query: ({ userId, goalId }) => ({
        url: `${userId}/goals/${goalId}`,
      }),
      transformResponse: (response) => {
        console.log(response); // Отладка ответа
        return {
          currentGoal: response?.currentGoal || {},
          organizations: response?.organizations || [],
        };
      },
      providesTags: (result, error, { goalId }) =>
        result ? [{ type: "Goal", id: goalId }] : [],
    }),
    
    postGoal: build.mutation({
      query: ({ userId, ...body }) => ({
        url: `${userId}/goals/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Goal", id: "LIST" }],
    }),
    updateGoal: build.mutation({
      query: ({ userId, goalId, ...body }) => ({
        url: `${userId}/goals/${goalId}/update`,
        method: "PATCH",
        body,
      }),
      // Обновляем теги, чтобы перезагрузить getGoal и getGoalId
      invalidatesTags: (result, error, { goalId }) => [
        { type: "Goal", id: goalId }, // обновляет конкретную цель
        { type: "Goal", id: "LIST" }, // обновляет общий список целей
      ],
    }),
  }),
});

export const {
  useGetGoalQuery,
  usePostGoalMutation,
  useGetGoalNewQuery,
  useGetGoalIdQuery,
  useUpdateGoalMutation,
} = goalApi;
