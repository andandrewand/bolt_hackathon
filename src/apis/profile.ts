// Need to use the React-specific entry point to allow generating React hooks
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQueryRetry } from "../axios";
import { METHOD_TYPE } from "../utils";
import { UserProfileReponse, UserProfileRequest } from "../modals";

// Define a service using a base URL and expected endpoints
export const profileApi = createApi({
  reducerPath: "profileApi",
  keepUnusedDataFor: 0,
  baseQuery: axiosBaseQueryRetry,
  endpoints(build) {
    return {
      profile: build.query<UserProfileReponse, UserProfileRequest>({
        query: ({ userId }: { userId: string }) => {
          return {
            url: `/profile`,
            method: METHOD_TYPE.GET,
            params: { userId },
          };
        },
      }),
    };
  },
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useLazyProfileQuery } = profileApi;
