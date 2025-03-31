
import { MessagesContainer } from "./messages/MessagesContainer";
import { motion } from "framer-motion";

export function Messages() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background"
    >
      <MessagesContainer />
    </motion.div>
  );
}
