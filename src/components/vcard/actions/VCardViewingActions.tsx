import { VCardActionButton } from "./VCardActionButton";
import { Share2, Edit, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface VCardViewingActionsProps {
  onShare: () => void;
  onEdit: () => void;
  onDownloadBusinessPDF: () => void;
  onDownloadCVPDF: () => void;
  isPdfGenerating: boolean;
}

export function VCardViewingActions({
  onShare,
  onEdit,
  onDownloadBusinessPDF,
  onDownloadCVPDF,
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
      <VCardActionButton
        icon={FileText}
        label="Business PDF"
        onClick={onDownloadBusinessPDF}
        variant="outline"
        disabled={isPdfGenerating}
      />
      <VCardActionButton
        icon={FileText}
        label="CV PDF"
        onClick={onDownloadCVPDF}
        variant="outline"
        disabled={isPdfGenerating}
      />
    </motion.div>
  );
}