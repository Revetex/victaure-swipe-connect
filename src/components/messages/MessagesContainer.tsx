import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Messages } from "./Messages";

const queryClient = new QueryClient();

export function MessagesContainer() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-full">
        <Messages />
      </div>
    </QueryClientProvider>
  );
}