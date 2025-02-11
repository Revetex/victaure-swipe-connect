
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { MessagesContainer } from "./messages/MessagesContainer";
import { motion } from "framer-motion";

const queryClient = new QueryClient();

export function Messages() {
  return (
    <QueryClientProvider client={queryClient}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 w-full h-full bg-background"
      >
        <MessagesContainer />
      </motion.div>
    </QueryClientProvider>
  );
}
