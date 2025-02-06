
import { NotesMap } from "@/components/notes/NotesMap";
import { motion } from "framer-motion";

export function NotesPage() {
  return (
    <motion.div 
      className="h-[calc(100dvh-4rem)] w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <NotesMap />
    </motion.div>
  );
}
