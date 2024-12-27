import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "./baseUrl";
import { prepareHeaders } from "./Function/prepareHeaders.js";

export const speedGoalApi = createApi({
  reducerPath: "speedSpeedGoalApi",
  tagTypes: ["SpeedGoal"],
  baseQuery: fetchBaseQuery({ baseUrl: url, prepareHeaders }),
  endpoints: (build) => ({
    getSpeedGoalId: build.query({
      query: ({ strategId }) => ({
        url: `objectives/${strategId}/objective`,
      }),
      transformResponse: (response) => {
        console.log(response);
        return {
          currentSpeedGoal: response || {},
        };
      },
      providesTags: [{ type: "SpeedGoal", id: "LIST" }],
    }),

    updateSpeedGoal: build.mutation({
      query: (body) => ({
        url: `objectives/${body._id}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "SpeedGoal", id: "LIST" }],
    }),
  }),
});

export const { useGetSpeedGoalIdQuery, useUpdateSpeedGoalMutation } =
  speedGoalApi;
