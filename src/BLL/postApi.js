import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postApi = createApi({
  reducerPath: "postApi",
  tagTypes: ["Post", "PostNew"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/" }),
  endpoints: (build) => ({
    
    getPosts: build.query({
      query: (userId = "") => ({
        url: `${userId}/posts`,
      }),
      providesTags: (result, error, userId) =>  [{ type: "Post", id: "LIST" }],
    }),

    postPosts: build.mutation({
      query: ({ userId, addPolicyId = "null", ...body }) => ({
        url: `${userId}/posts/new?addPolicyId=${addPolicyId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }, { type: "PostNew", id: "NEW" }],
    }),

    getPostNew: build.query({
      query: (userId = "") => ({
        url: `${userId}/posts/new`,
      }),
      transformResponse: (response) => {
        console.log(response); // Отладка ответа
        return {
          workers: response?.workers || [],
          policies: response?.policies || [],
          posts: response?.posts || [],
          organizations: response?.organizations || [],
          maxDivisionNumber: response?.maxDivisionNumber,
        };
      },
      providesTags: (result, error, userId) => [{ type: "Post", id: "LIST" }, { type: "PostNew", id: "NEW" }],
    }),

    getPostId: build.query({
      query: ({userId, postId}) => ({
        url: `${userId}/posts/${postId}`,
      }),
      providesTags: (result, error, { postId }) => [{ type: 'Post', id: postId }],
      transformResponse: (response) => {
        console.log(response); // Отладка ответа
        return {
          currentPost: response?.currentPost || {},
          parentPost: response?.parentPost || {},
          policyDB: response?.currentPost?.policy.id || null,
          workers: response?.workers || [],
          organizations: response?.organizations || [],
          policies: response?.policiesActive || [],
          posts: response?.posts || [],
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
  }),
});

export const { useGetPostsQuery, useGetPostNewQuery, usePostPostsMutation, useGetPostIdQuery, useUpdatePostsMutation } = postApi;
