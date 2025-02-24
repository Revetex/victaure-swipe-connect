
import { MessagesContainer } from "./MessagesContainer";
import { motion } from "framer-motion";

export function Messages() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#1B2A4A]"
    >
      <MessagesContainer />
    </motion.div>
  );
}
