// Need to use the React-specific entry point to allow generating React hooks
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQueryRetry } from "../axios";
import { METHOD_TYPE } from "../utils";
import {
  BidHistoryRequest,
  BidRequest,
  SessionList,
  SessionsResponse,
} from "../modals";
import { format, subHours } from "date-fns";

// Define a service using a base URL and expected endpoints
export const bidApi = createApi({
  reducerPath: "bidApi",
  baseQuery: axiosBaseQueryRetry,
  keepUnusedDataFor: 0,
  endpoints(build) {
    return {
      sessions: build.query<SessionsResponse, { limit: number }>({
        query: ({ limit }) => ({
          url: "/sessions",
          method: METHOD_TYPE.GET,
          params: { limit },
        }),
        transformResponse: (response: SessionsResponse) => {
          return {
            ...response,
            sessions: response.sessions
              .filter((session: SessionList) => session.statusLabel === "past")
              .map((result: SessionList) => {
                return {
                  ...result,
                  candleTimestamp: format(
                    subHours(result.candleTimestamp, 8),
                    "HH:mm"
                  ),
                };
              }),
            scheduled: response.sessions
              .filter((session: SessionList) => session.statusLabel !== "past")
              // .map((session: SessionList) => {
              //   return {
              //     ...session,
              //     candleTimestamp: "2025-06-29T00:29:00Z", //TODO: to remove this map function
              //   };
              // }),
          };
        },
      }),
      bidHistory: build.mutation<any, BidHistoryRequest>({
        query: ({ userId, roundId }) => ({
          url: "/bid-history",
          method: METHOD_TYPE.POST,
          data: { userId, roundId },
        }),
      }),
      bid: build.mutation<any, BidRequest>({
        query: (body) => ({
          url: "/bid",
          method: METHOD_TYPE.POST,
          data: body,
        }),
      }),
    };
  },
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useSessionsQuery, useBidHistoryMutation, useBidMutation } =
  bidApi;
