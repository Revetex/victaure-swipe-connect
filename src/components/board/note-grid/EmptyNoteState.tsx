
import { StickyNoteIcon } from "lucide-react";
import { motion } from "framer-motion";

export function EmptyNoteState() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className="flex flex-col items-center justify-center min-h-[300px] text-center p-8 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/20"
    >
      <StickyNoteIcon className="h-16 w-16 text-muted-foreground opacity-50 mb-6" />
      <h3 className="text-xl font-medium text-muted-foreground mb-2">Aucune note</h3>
      <p className="text-sm text-muted-foreground max-w-[300px]">
        Créez votre première note en utilisant le formulaire ci-dessus
      </p>
    </motion.div>
  );
}
