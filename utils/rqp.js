"use client"
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useState } from 'react';

function ReactQueryProvider({ children }) {
    const queryClient = useState(
      () =>
        new QueryClient({
          defaultOptions: { queries: { staleTime: 5000 } },
        })
    );
  
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }
  
  export default ReactQueryProvider;

