import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { MessagesWrapper } from "./messages/MessagesWrapper";

const queryClient = new QueryClient();

export function Messages() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-full">
        <MessagesWrapper />
      </div>
    </QueryClientProvider>
  );
}