
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { MessagesContainer } from "./messages/MessagesContainer";

const queryClient = new QueryClient();

export function Messages() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="fixed inset-0 w-full h-full bg-background">
        <MessagesContainer />
      </div>
    </QueryClientProvider>
  );
}
