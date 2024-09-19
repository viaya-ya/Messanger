import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const policyApi = createApi({
    reducerPath: 'policy',
    tagTypes: ['Policy'],
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:5000/'}),
    endpoints: (build) => ({
        getPolicies: build.query({
            query: (userId = '') => ({
                url: `${userId}/policies`,
              }),
            providesTags: (result) => result
              ? [
                  ...result.map(({ id }) => ({ type: 'Policy', id })),
                  { type: 'Policy', id: 'LIST' },
                ]
              : [{ type: 'Policy', id: 'LIST' }],
        }),
        postPolicies: build.mutation({
            query: ({ userId, ...body }) => ({
                url: `${userId}/policies/new`,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{type: 'Policy', id: 'LIST'}]
        })
    })
});

export const {useGetPoliciesQuery, usePostPoliciesMutation} = policyApi;
