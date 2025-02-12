
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { MessagesContainer } from "./messages/MessagesContainer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true,
      retry: 1
    },
  },
});

export function Messages() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="fixed inset-0 pt-16 w-full h-[calc(100vh-4rem)] bg-background">
        <MessagesContainer />
      </div>
    </QueryClientProvider>
  );
}
