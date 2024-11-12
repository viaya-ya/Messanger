import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const organizationApi = createApi({
  reducerPath: "organizationApi",
  tagTypes: ["Organization"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/" }),
  endpoints: (build) => ({

    getOrganizations: build.query({
      query: (userId = "") => ({
        url: `${userId}/organizations`,
      }),
      providesTags: (result) => result ? [{type: 'Organization', id: "LIST"}] : [],
    }),

   
  }),
});

export const {useGetOrganizationsQuery} = organizationApi;
