import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const statisticsApi = createApi({
  reducerPath: "statisticsApi",
  tagTypes: ["Statistics", "Statistics1"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/" }),
  endpoints: (build) => ({

    getStatistics: build.query({
      query: ({userId, statisticData = true}) => ({
        url: `${userId}/statistics/?statisticData=${statisticData}`,
      }),
      providesTags: (result) => result ? [{type: 'Statistics', id: "LIST"}] : [],
    }),

    postStatistics: build.mutation({
      query: ({userId = "", ...body}) => ({
        url: `${userId}/statistics/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result) => result ? [{type: "Statistics", id: "LIST" }] : []
    }),

    getStatisticsNew: build.query({
      query: (userId = "") => ({
        url: `${userId}/statistics/new`,
      }),
      transformResponse: (response) => {
        return {
          posts: response || [],
        };
      },
    }),

    getStatisticsId: build.query({
      query: ({userId, statisticId}) => ({
        url: `${userId}/statistics/${statisticId}`,
      }),
      transformResponse: (response) => {
        return {
          currentStatistic: response || {}, 
          statisticDatas: response.statisticDatas || [], 
        };
      },
      providesTags: (result, error,  {statisticId}) => result ? [{type: "Statistics1", id: statisticId }]: []
    }),

    updateStatistics: build.mutation({
      query: ({userId, statisticId , ...body}) => ({
        url: `${userId}/statistics/${statisticId}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error,  {statisticId}) => result ? [{type: "Statistics1", id: statisticId }] : []
    }),

    // для поста
    updateStatisticsToPostId: build.mutation({
      query: ({userId, postId , ...body}) => ({
        url: `${userId}/statistics/${postId}/updateBulk`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result) => result ? [{type: "Statistics", id: "LIST" }] : []
    }),

  }),
});

export const {usePostStatisticsMutation, useGetStatisticsNewQuery, useGetStatisticsIdQuery, useGetStatisticsQuery, useUpdateStatisticsMutation, useUpdateStatisticsToPostIdMutation} = statisticsApi;
