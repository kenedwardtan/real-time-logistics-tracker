import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Driver, Delivery } from "@/lib/types";

export const logisticsApi = createApi({
  reducerPath: "logisticsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Driver", "Delivery"],
  endpoints: (builder) => ({
    getDrivers: builder.query<Driver[], void>({
      query: () => "drivers",
      providesTags: ["Driver"],
    }),
    updateDriverLocation: builder.mutation<
      Driver,
      { driverId: string; location: { lat: number; lng: number } }
    >({
      query: ({ driverId, location }) => ({
        url: `drivers/${driverId}/location`,
        method: "PATCH",
        body: location,
      }),
      invalidatesTags: ["Driver"],
    }),
    getDeliveries: builder.query<Delivery[], void>({
      query: () => "deliveries",
      providesTags: ["Delivery"],
    }),
  }),
});

export const {
  useGetDriversQuery,
  useUpdateDriverLocationMutation,
  useGetDeliveriesQuery,
} = logisticsApi;
