import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,

      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes

      refetchOnReconnect: true,
      throwOnError: true, // bubble errors to the nearest error boundary instead of returning them in the query result
    },
    mutations: {
      retry: 0, // not retry post, put, delete
      throwOnError: true,
    },
  },
});
