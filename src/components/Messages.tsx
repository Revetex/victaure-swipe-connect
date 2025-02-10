
import { MessagesContainer } from "./messages/MessagesContainer";
import { motion } from "framer-motion";

export function Messages() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-[calc(100vh-3.5rem)] lg:h-screen overflow-hidden bg-gradient-to-br from-emerald-50/50 via-background to-emerald-50/30"
    >
      <div className="flex-1 container max-w-6xl mx-auto p-4 lg:p-6">
        <MessagesContainer />
      </div>
    </motion.div>
  );
}
