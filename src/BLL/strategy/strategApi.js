import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url, selectedOrganizationId } from "../baseUrl";
import { prepareHeaders } from "../Function/prepareHeaders.js";

export const strategApi = createApi({
  reducerPath: "strategApi",
  tagTypes: ["Strategy"],
  baseQuery: fetchBaseQuery({ baseUrl: url, prepareHeaders }),
  endpoints: (build) => ({
    getStrategies: build.query({
      query: () => ({
        url: `strategies/${selectedOrganizationId}`,
      }),
      transformResponse: (response) => {
        const completedStrategies = response
          ?.filter((item) => item.state === "Завершено")
          .sort((a, b) => b.strategyNumber - a.strategyNumber);

        const draftAndActiveStrategies = response
          ?.filter(
            (item) => item.state === "Активный" || item.state === "Черновик"
          )
          .sort((a, b) => {
            if (a.state === "Черновик" && b.state === "Активный") return -1;
            if (a.state === "Активный" && b.state === "Черновик") return 1;
            return 0;
          });

        const hasDraftStrategy = response?.some(
          (item) => item.state === "Черновик"
        );

        const activeStrategyId = response?.find(
          (item) => item.state === "Активный"
        )?.id;

        return {
          hasDraftStrategy: hasDraftStrategy,
          completedStrategies: completedStrategies,
          draftAndActiveStrategies: draftAndActiveStrategies,
          activeStrategyId: activeStrategyId,
        };
      },
      providesTags: [{ type: "Strategy", id: "LIST" }],
    }),

    getStrategId: build.query({
      query: ({ strategyId }) => ({
        url: `strategies/${strategyId}/strategy`,
      }),
      transformResponse: (response) =>  ({
        currentStrategy: response || {},
        currentStrategyState: response.state || "",
      }),
      providesTags: [{ type: "Strategy", id: "LIST" }],
    }),

    postStrateg: build.mutation({
      query: (body) => ({
        url: `strategies/new`,
        method: "POST",
        body: {
          ...body,
          organizationId: selectedOrganizationId,
        },
      }),
      transformResponse: (response) => ({
        id: response.id,
      }),
      invalidatesTags:[{ type: "Strategy", id: "LIST" }],
    }),

    updateStrateg: build.mutation({
      query: (body) => ({
        url: `strategies/${body._id}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Strategy", id: "LIST" }],
    }),
  }),
});

export const {
  usePostStrategMutation,
  useGetStrategiesQuery,
  useGetStrategIdQuery,
  useUpdateStrategMutation,
} = strategApi;
