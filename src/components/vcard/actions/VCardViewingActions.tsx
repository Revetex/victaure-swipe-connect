import { VCardActionButton } from "./VCardActionButton";
import { Share2, Edit } from "lucide-react";
import { motion } from "framer-motion";

interface VCardViewingActionsProps {
  onShare: () => void;
  onEdit: () => void;
  isPdfGenerating: boolean;
}

export function VCardViewingActions({
  onShare,
  onEdit,
  isPdfGenerating
}: VCardViewingActionsProps) {
  return (
    <motion.div className="flex flex-wrap gap-3">
      <VCardActionButton
        icon={Share2}
        label="Partager"
        onClick={onShare}
      />
      <VCardActionButton
        icon={Edit}
        label="Mode édition"
        onClick={onEdit}
        variant="outline"
      />
    </motion.div>
  );
}