// Need to use the React-specific entry point to allow generating React hooks
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQueryRetry } from "../axios";
import { LoginRequest, LoginResponse } from "../modals";
import { METHOD_TYPE } from "../utils";

// Define a service using a base URL and expected endpoints
export const loginApi = createApi({
  reducerPath: "loginApi",
  baseQuery: axiosBaseQueryRetry,
  endpoints(build) {
    return {
      loginCredentials: build.mutation<LoginResponse, LoginRequest>({
        query: (body: LoginRequest) => ({
          url: "/login",
          method: METHOD_TYPE.POST,
          data: JSON.stringify(body),
        }),
      }),
    };
  },
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useLoginCredentialsMutation } = loginApi;
