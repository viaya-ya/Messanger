import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {url} from "./baseUrl"

export const speedGoalApi = createApi({
  reducerPath: "speedSpeedGoalApi",
  tagTypes: ["SpeedGoal"],
  baseQuery: fetchBaseQuery({ baseUrl: url }),
  endpoints: (build) => ({
    getSpeedGoals: build.query({
      query: (userId = "") => ({
        url: `${userId}/objectives`,
      }),
      transformResponse: (response) => {
        const sortedStrategies = response
          ?.flatMap((objective) => objective.strategy)
          .sort((a, b) => {
            const stateA = a.state || "";
            const stateB = b.state || "";

            if (stateA === "Активный" && stateB !== "Активный") return -1;
            if (stateB === "Активный" && stateA !== "Активный") return 1;

            if (stateA === "Черновик" && stateB !== "Черновик") return -1;
            if (stateB === "Черновик" && stateA !== "Черновик") return 1;

            return 0;
          });

        const activeAndDraftStrategies = sortedStrategies.filter(
          (strategy) =>
            strategy.state === "Активный" || strategy.state === "Черновик"
        ).sort((a, b) => {
          if (a.state === "Черновик" && b.state !== "Черновик") return 1;
          if (b.state === "Черновик" && a.state !== "Черновик") return -1;
          return a.strategyNumber - b.strategyNumber;
        });

        const otherStrategies = sortedStrategies.filter(
          (strategy) =>
            strategy.state !== "Активный" && strategy.state !== "Черновик"
        ).sort((a,b) => a.strategyNumber - b.strategyNumber);

        return {
          activeAndDraftStrategies: activeAndDraftStrategies,
          archiveStrategies: otherStrategies,
        };
      },
    }),

    getSpeedGoalNew: build.query({
      query: (userId = "") => ({
        url: `${userId}/objectives/new`,
      }),
      providesTags: (result, error, userId) =>
        result ? [{ type: "SpeedGoal", id: userId }] : [],
    }),

    postSpeedGoal: build.mutation({
      query: ({ userId, ...body }) => ({
        url: `${userId}/objectives/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "SpeedGoal", id: userId },
      ],
    }),

    getSpeedGoalUpdate: build.query({
      query: (userId = "") => ({
        url: `${userId}/objectives/update`,
      }),
      providesTags: (result, error, userId) =>
        result ? [{ type: "SpeedGoal", id: userId }] : [],
    }),

    getSpeedGoalId: build.query({
      query: ({ userId, strategId }) => ({
        url: `${userId}/objectives/${strategId}`,
      }),
      transformResponse: (response) => {
        return {
          currentSpeedGoal: response || {},
        };
      },
      providesTags: (result, error, { strategId }) =>
        result ? [{ type: "SpeedGoal", id: strategId }] : [],
    }),

    updateSpeedGoal: build.mutation({
      query: ({ userId, objectiveId, ...body }) => ({
        url: `${userId}/objectives/${objectiveId}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { objectiveId, strategId }) => [
        { type: "SpeedGoal", id: objectiveId }, // Обновляем текущую цель
        { type: "SpeedGoal", id: strategId }, // Обновляем стратегию для getSpeedGoalId
        { type: "SpeedGoal", id: "LIST" }, // Обновляем список
      ],
    }),
  }),
});

export const {
  useGetSpeedGoalsQuery,
  useGetSpeedGoalNewQuery,
  usePostSpeedGoalMutation,
  useGetSpeedGoalIdQuery,
  useUpdateSpeedGoalMutation,
  useGetSpeedGoalUpdateQuery,
} = speedGoalApi;
