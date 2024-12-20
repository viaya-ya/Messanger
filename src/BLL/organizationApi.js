import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {url} from "./baseUrl"
import {prepareHeaders} from "./Function/prepareHeaders.js"

export const organizationApi = createApi({
  reducerPath: "organizationApi",
  tagTypes: ["Organization"],
  baseQuery: fetchBaseQuery({ baseUrl: url, prepareHeaders }),
  endpoints: (build) => ({

    getOrganizations: build.query({
      query: (userId = "") => ({
        url: `${userId}/organizations`,
      }),
      providesTags: (result) => result ? [{type: 'Organization', id: "LIST"}] : [],
    }),

    updateOrganizations: build.mutation({
      query: ({userId, organizationId , ...body}) => ({
        url: `${userId}/organizations/${organizationId}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error) => result ? [{type: "Organization", id: "LIST" }] : []
    }),
    
  }),
});

export const {useGetOrganizationsQuery, useUpdateOrganizationsMutation} = organizationApi;
