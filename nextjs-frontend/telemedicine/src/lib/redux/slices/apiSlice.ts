import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Doctor', 'Device', 'Session'],
  endpoints: (builder) => ({
    // Auth endpoints
    loginDoctor: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logoutDoctor: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    
    // Device endpoints
    registerDevice: builder.mutation({
      query: (deviceData) => ({
        url: '/devices/register',
        method: 'POST',
        body: deviceData,
      }),
      invalidatesTags: ['Device'],
    }),
    getDevices: builder.query({
      query: () => '/devices',
      providesTags: ['Device'],
    }),
    
    // Session endpoints
    createSession: builder.mutation({
      query: (sessionData) => ({
        url: '/sessions',
        method: 'POST',
        body: sessionData,
      }),
      invalidatesTags: ['Session'],
    }),
    getSessions: builder.query({
      query: () => '/sessions',
      providesTags: ['Session'],
    }),
    updateSessionStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/sessions/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Session'],
    }),
    
    // Admin endpoints
    getDashboardStats: builder.query({
      query: () => '/admin/dashboard',
    }),
  }),
});

export const {
  useLoginDoctorMutation,
  useLogoutDoctorMutation,
  useRegisterDeviceMutation,
  useGetDevicesQuery,
  useCreateSessionMutation,
  useGetSessionsQuery,
  useUpdateSessionStatusMutation,
  useGetDashboardStatsQuery,
} = apiSlice;