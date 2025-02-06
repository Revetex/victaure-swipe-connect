
import { ListTodo } from "lucide-react";
import { motion } from "framer-motion";

export function EmptyPostState() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center text-muted-foreground py-12"
    >
      <ListTodo className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <p className="text-lg">Aucune publication</p>
      <p className="text-sm mt-2">
        Soyez le premier à partager quelque chose !
      </p>
    </motion.div>
  );
}
