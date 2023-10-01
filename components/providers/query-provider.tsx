"use client";

// The code you provided is using the QueryClient and QueryClientProvider from the @tanstack/react-query library. This library is a powerful tool for fetching, caching synchronizing, and updating server state in throughout out React application from anywhere. Thats why we also declare it in our Root folder to be accessible throughout the app

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  // in this case, queryClient is a state variable that holds an instance of QueryClient. This instance is created only once when the component is first rendered, and the same instance is used in all subsequent re-renders. This is important because we typically want to use the same QueryClient instance throughout our app to take advantage of caching and other features provided by React Query

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
