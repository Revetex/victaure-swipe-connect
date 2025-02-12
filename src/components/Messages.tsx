
import { useUserChat } from "@/hooks/useUserChat";
import { MessagesContainer } from "./messages/MessagesContainer";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

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
      <div className="h-[calc(100vh-3.5rem)] max-w-[calc(100vw-16rem)] lg:max-w-[calc(100vw-16rem)] overflow-hidden relative bg-background">
        <MessagesContainer />
      </div>
    </QueryClientProvider>
  );
}
