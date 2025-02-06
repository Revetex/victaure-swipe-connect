
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface FutureFeatureProps {
  Icon: LucideIcon;
  title: string;
}

export function FutureFeature({ Icon, title }: FutureFeatureProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
      }}
      className="flex items-center justify-center h-full"
    >
      <div className="text-center space-y-4">
        <Icon className="h-12 w-12 mx-auto text-muted-foreground" />
        <p className="text-muted-foreground">{title} (Bientôt disponible)</p>
      </div>
    </motion.div>
  );
}
