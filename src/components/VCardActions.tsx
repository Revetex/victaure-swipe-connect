import { Button } from "@/components/ui/button";
import { Share2, Download, Copy, Save, FileText, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

interface VCardActionsProps {
  isEditing: boolean;
  onShare: () => void;
  onDownload: () => void;
  onDownloadPDF: () => void;
  onDownloadBusinessPDF: () => void;
  onDownloadCVPDF: () => void;
  onCopyLink: () => void;
  onSave: () => void;
  onApplyChanges: () => void;
  setIsEditing: (isEditing: boolean) => void;
}

export function VCardActions({
  isEditing,
  onShare,
  onDownload,
  onDownloadPDF,
  onDownloadBusinessPDF,
  onDownloadCVPDF,
  onCopyLink,
  onSave,
  onApplyChanges,
  setIsEditing,
}: VCardActionsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* QR Code Section */}
      {!isEditing && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-end mb-4"
        >
          <div className="p-2 glass-card group hover:scale-105 transition-transform duration-300">
            <QRCodeSVG
              value={window.location.href}
              size={85}
              level="H"
              includeMargin={false}
              className="rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </motion.div>
      )}

      {/* Actions Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-wrap gap-3 pt-4 border-t border-white/20"
      >
        {isEditing ? (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 min-w-[120px]"
            >
              <Button 
                onClick={onSave}
                className="w-full bg-white hover:bg-white/90 text-indigo-600 transition-colors"
              >
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder
              </Button>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 min-w-[120px]"
            >
              <Button 
                onClick={onApplyChanges}
                variant="outline" 
                className="w-full border-white/20 hover:bg-white/10 text-white transition-colors"
              >
                Appliquer
              </Button>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 min-w-[100px]"
            >
              <Button 
                onClick={onShare}
                className="w-full bg-white hover:bg-white/90 text-indigo-600 transition-colors"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Partager
              </Button>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 min-w-[100px]"
            >
              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="w-full border-white/20 hover:bg-white/10 text-white transition-colors"
              >
                <Edit className="mr-2 h-4 w-4" />
                Mode édition
              </Button>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 min-w-[100px]"
            >
              <Button 
                onClick={onDownload}
                variant="outline"
                className="w-full border-white/20 hover:bg-white/10 text-white transition-colors"
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 min-w-[100px]"
            >
              <Button 
                onClick={onDownloadBusinessPDF}
                variant="outline"
                className="w-full border-white/20 hover:bg-white/10 text-white transition-colors"
              >
                <FileText className="mr-2 h-4 w-4" />
                Business PDF
              </Button>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 min-w-[100px]"
            >
              <Button 
                onClick={onDownloadCVPDF}
                variant="outline"
                className="w-full border-white/20 hover:bg-white/10 text-white transition-colors"
              >
                <FileText className="mr-2 h-4 w-4" />
                CV PDF
              </Button>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button 
                onClick={onCopyLink}
                variant="outline"
                className="border-white/20 hover:bg-white/10 text-white transition-colors"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}