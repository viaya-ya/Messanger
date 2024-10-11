import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const projectApi = createApi({
  reducerPath: "projectApi",
  tagTypes: ["Project", "Project1"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/" }),
  endpoints: (build) => ({
    getProject: build.query({
      query: (userId = "") => ({
        url: `${userId}/projects`,
      }),
      providesTags: (result) => result ? [{type: 'Project', id: "LIST"}] : [],
    }),

    postProject: build.mutation({
      query: ({ userId, ...body }) => ({
        url: `${userId}/projects/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result) => result ? [{type: 'Project', id: "LIST"}] : [],
    }),

    getProjectNew: build.query({
      query: (userId = "") => ({
        url: `${userId}/projects/new`,
      }),
      transformResponse: (response) => {
        console.log(response); // Отладка ответа
        return {
          workers: response?.workers || [],
          strategies: response?.strategies || [],
          organizations: response?.organizations || [],
          programsWithoutProject: response?.programsWithoutProject || [],
        };
      },
    }),

    getProjectId: build.query({
      query: ({userId, projectId}) => ({
        url: `${userId}/projects/${projectId}`,
      }),
      transformResponse: (response) => ({ 
        currentProject: response || {}, 
        targets: response?.targets || [], 
        projectToOrganizations: response?.projectToOrganizations || [] 
      }),
      providesTags: (result, error,  {projectId}) => result ? [{type: "Project1", id: projectId }]: []
    }),

    updateProject: build.mutation({
      query: ({userId, projectId , ...body}) => ({
        url: `${userId}/projects/${projectId}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error,  {projectId}) => result ? [{type: "Project1", id: projectId }]: []
    }),
  }),
});

export const { useGetProjectQuery, useGetProjectNewQuery, usePostProjectMutation, useGetProjectIdQuery, useUpdateProjectMutation } = projectApi;
