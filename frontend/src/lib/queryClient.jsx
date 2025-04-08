// // src/lib/queryClient.js
// import { QueryClient } from '@tanstack/react-query';

// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 1000 * 60 * 5, // 5 minutes
//       cacheTime: 1000 * 60 * 30, // 30 minutes
//       retry: 2, // Retry failed queries 2 times
//       refetchOnWindowFocus: false, // Disable refetch on window focus
//     },
//   },
// });