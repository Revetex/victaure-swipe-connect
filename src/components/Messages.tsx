
import { useUserChat } from "@/hooks/useUserChat";
import { MessagesContainer } from "./messages/MessagesContainer";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      cacheTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true,
      retry: 1
    },
  },
});

export function Messages() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="fixed inset-0 w-full h-full bg-background">
        <MessagesContainer />
      </div>
    </QueryClientProvider>
  );
}
