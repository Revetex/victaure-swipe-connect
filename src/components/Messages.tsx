
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { MessagesContainer } from "./messages/MessagesContainer";

const queryClient = new QueryClient();

export function Messages() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <MessagesContainer />
      </div>
    </QueryClientProvider>
  );
}
