import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const speedGoalApi = createApi({
  reducerPath: "speedSpeedGoalApi",
  tagTypes: ["SpeedGoal"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/" }),
  endpoints: (build) => ({
    
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
      invalidatesTags: (result, error, { userId }) => 
        [{ type: "SpeedGoal", id: userId }], 
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
        { type: "SpeedGoal", id: strategId },   // Обновляем стратегию для getSpeedGoalId
        { type: "SpeedGoal", id: "LIST" },      // Обновляем список
      ],
    }),
  }),
});

export const {
  useGetSpeedGoalNewQuery,
  usePostSpeedGoalMutation,
  useGetSpeedGoalIdQuery,
  useUpdateSpeedGoalMutation,
  useGetSpeedGoalUpdateQuery
} = speedGoalApi;
