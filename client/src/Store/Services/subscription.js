import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createSelector } from "@reduxjs/toolkit";

export const subscriptionsApi = createApi({
  reducerPath: "subscriptions",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/gym",
  }),
  endpoints: (builder) => ({
    getSubscriptions: builder.query({
      query: () => `/subscription`,
    }),
  }),
});

export const { useGetSubscriptionsQuery } = subscriptionsApi;
export const selectUsersResult =
  subscriptionsApi.endpoints.getSubscriptions.select();

export const selectAll = createSelector(selectUsersResult);
