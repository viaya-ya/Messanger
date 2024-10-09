import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const strategApi = createApi({
  reducerPath: "strategApi",
  tagTypes: ["Strateg", "Strateg1"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/" }),
  endpoints: (build) => ({
    getStrateg: build.query({
      query: (userId = "") => ({
        url: `${userId}/strategies`,
      }),
      providesTags: (result) => result ? [{ type: "Strateg", id: "LIST" }] : [],
    }),
    postStrateg: build.mutation({
      query: ({userId = "", ...body}) => ({
        url: `${userId}/strategies/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result) => result ? [{type: "Strateg", id: "LIST" }] : []
    }),


    getStrategNew: build.query({
      query: (userId = "") => ({
        url: `${userId}/strategies/new`,
      }),
      transformResponse: (response) => ({ organizations: response || [] }),
    }),

    getStrategId: build.query({
      query: ({userId, strategyId}) => ({
        url: `${userId}/strategies/${strategyId}`,
      }),
      transformResponse: (response) => ({ 
        currentStrategy: response?.currentStrategy || {}, 
        organizations: response?.organizations || {} 
      }),
      providesTags: (result, error,  {strategyId}) => result ? [{type: "Strateg1", id: strategyId }]: []
    }),

    updateStrateg: build.mutation({
      query: ({userId, strategyId , ...body}) => ({
        url: `${userId}/strategies/${strategyId}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result,  error,  {strategyId}) => result ? [{type: "Strateg1", id: strategyId}]: []
    }),
  }),
});

export const { useGetStrategNewQuery, usePostStrategMutation, useGetStrategQuery, useGetStrategIdQuery, useUpdateStrategMutation } = strategApi;
