import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,

      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes

      refetchOnReconnect: true,
      // Keep errors in the query result; the UI currently reads `query.error` instead of relying on an error boundary.
      throwOnError: false,
    },
    mutations: {
      retry: 0, // not retry post, put, delete
      throwOnError: false,
    },
  },
});
