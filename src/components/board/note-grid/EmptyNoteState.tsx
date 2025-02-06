
import { StickyNoteIcon } from "lucide-react";
import { motion } from "framer-motion";

export function EmptyNoteState() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[200px] text-center"
    >
      <StickyNoteIcon className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
      <p className="text-lg font-medium text-muted-foreground">Aucune note</p>
      <p className="text-sm text-muted-foreground mt-2">
        Créez votre première note en utilisant le formulaire ci-dessus
      </p>
    </motion.div>
  );
}
