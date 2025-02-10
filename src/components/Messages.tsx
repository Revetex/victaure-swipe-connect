
import { MessagesContainer } from "./messages/MessagesContainer";
import { motion } from "framer-motion";

export function Messages() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-[calc(100vh-3.5rem)] lg:h-screen overflow-hidden bg-white dark:bg-gray-900"
    >
      <div className="flex-1 container max-w-6xl mx-auto p-4 lg:p-6">
        <div className="h-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm">
          <MessagesContainer />
        </div>
      </div>
    </motion.div>
  );
}
