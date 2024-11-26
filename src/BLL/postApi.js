import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postApi = createApi({
  reducerPath: "postApi",
  tagTypes: ["Post", "PostNew", "Statistics"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/" }),
  endpoints: (build) => ({
    
    getPosts: build.query({
      query: (userId = "") => ({
        url: `${userId}/posts`,
      }),
      transformResponse: (response) => {
        return response.sort((a, b) => a.postName.localeCompare(b.postName));
      },
      providesTags: (result, error, userId) =>  [{ type: "Post", id: "LIST" }],
    }),

    postPosts: build.mutation({
      query: ({ userId, addPolicyId = "null", ...body }) => ({
        url: `${userId}/posts/new?addPolicyId=${addPolicyId}`,
        method: "POST",
        body,
      }),
      transformErrorResponse: (response) => {
        return{
          id: response?.id,
        }
      },
      invalidatesTags: [{ type: "Post", id: "LIST" }, { type: "PostNew", id: "NEW" }],
    }),

    getPostNew: build.query({
      query: (userId = "") => ({
        url: `${userId}/posts/new`,
      }),
      transformResponse: (response) => {
        console.log(response); // Отладка ответа
        const sortWorkers = response?.workers?.sort((a, b) => {
          const lastNameComparison = a.lastName.localeCompare(b.lastName);
          if (lastNameComparison !== 0) {
            return lastNameComparison; // Если фамилии разные, сортируем по ним
          }
          return a.firstName.localeCompare(b.firstName); // Если фамилии одинаковы, сортируем по имени
        });
        
        const sortPolicies = response?.policies?.sort((a, b) => a.policyName.localeCompare(b.policyName));
        const sortPosts = response?.posts?.sort((a, b) => a.postName.localeCompare(b.postName));
        const sortOrganizations = response?.organizations?.sort((a, b) => a.organizationName.localeCompare(b.organizationName));
        return {
          workers: sortWorkers || [],
          policies: sortPolicies || [],
          posts: sortPosts || [],
          organizations:sortOrganizations || [],
          maxDivisionNumber: response?.maxDivisionNumber,
        };
      },
      providesTags: (result, error, userId) => [{ type: "Post", id: "LIST" }, { type: "PostNew", id: "NEW" }],
    }),

    getPostId: build.query({
      query: ({userId, postId}) => ({
        url: `${userId}/posts/${postId}`,
      }),
      providesTags: (result, error, { postId }) => [{ type: 'Post', id: postId }, { type: "Statistics", id: "LIST" }],
      transformResponse: (response) => {
        console.log(response); // Отладка ответа
        const sortWorkers = response?.workers?.sort((a, b) => {
          const lastNameComparison = a.lastName.localeCompare(b.lastName);
          if (lastNameComparison !== 0) {
            return lastNameComparison; // Если фамилии разные, сортируем по ним
          }
          return a.firstName.localeCompare(b.firstName); // Если фамилии одинаковы, сортируем по имени
        });
        
        const sortPoliciesActive = response?.policiesActive?.sort((a, b) => a.policyName.localeCompare(b.policyName));
        const sortPosts = response?.posts?.sort((a, b) => a.postName.localeCompare(b.postName));
        const sortOrganizations = response?.organizations?.sort((a, b) => a.organizationName.localeCompare(b.organizationName));

        return {
          currentPost: response?.currentPost || {},
          parentPost: response?.parentPost || {},
          policyDB: response?.currentPost?.policy?.id || null,

          workers: sortWorkers || [],
          organizations:sortOrganizations || [],
          policies: sortPoliciesActive || [],
          posts: sortPosts || [],

          statisticsIncludedPost: response?.currentPost.statistics || [],
        };
      },
    }),

    updatePosts: build.mutation({
      query: ({ userId, postId, ...body }) => ({
        url: `${userId}/posts/${postId}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: "LIST" },  // Инвалидация списка постов
        { type: "Post", id: postId },  // Инвалидация конкретного поста
      ],
    }),

    updateStatisticsToPostId: build.mutation({
      query: ({ userId, postId, ...body }) => ({
        url: `${userId}/statistics/${postId}/updateBulk`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result) =>
        result ? [{ type: "Statistics", id: "LIST" }] : [],
    }),

  }),
});

export const { useGetPostsQuery, useGetPostNewQuery, usePostPostsMutation, useGetPostIdQuery, useUpdatePostsMutation, useUpdateStatisticsToPostIdMutation } = postApi;
