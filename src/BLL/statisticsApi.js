import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const statisticsApi = createApi({
  reducerPath: "statisticsApi",
  tagTypes: ["Statistics", "Statistics1"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/" }),
  endpoints: (build) => ({

    getStatistics: build.query({
      query: (userId = "") => ({
        url: `${userId}/statistics`,
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
        console.log(response); // Отладка ответа
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
        console.log(response); // Отладка ответа
        return {
          currentStatistic: response || {}, 
          statisticDatas: response.statisticDatas || [], 
          reportDay: response.post.organization.reportDay || ""
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
      invalidatesTags: (result, error,  {statisticId}) => result ? [{type: "Statistics1", id: statisticId }]: []
    }),

  }),
});

export const {usePostStatisticsMutation, useGetStatisticsNewQuery, useGetStatisticsIdQuery, useGetStatisticsQuery, useUpdateStatisticsMutation} = statisticsApi;
