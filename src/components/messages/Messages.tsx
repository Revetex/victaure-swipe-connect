
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { MessagesContainer } from "./MessagesContainer";

const queryClient = new QueryClient();

export function Messages() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-full">
        <MessagesContainer />
      </div>
    </QueryClientProvider>
  );
}
