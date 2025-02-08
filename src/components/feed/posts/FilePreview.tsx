
import { X, ImagePlus } from "lucide-react";
import { motion } from "framer-motion";
import { PostAttachment } from "./types";

interface FilePreviewProps {
  files: PostAttachment[];
  onRemove: (index: number) => void;
}

// Changed to default export for lazy loading
export default function FilePreview({ files, onRemove }: FilePreviewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-wrap gap-2"
    >
      {files.map((attachment, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="relative group"
        >
          {attachment.file.type.startsWith('image/') ? (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
              <img
                src={attachment.preview}
                alt={attachment.file.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ) : (
            <div className="h-20 w-20 flex items-center justify-center bg-muted rounded-lg">
              <span className="text-xs text-center break-words p-2">
                {attachment.file.name}
              </span>
            </div>
          )}
          <button
            onClick={() => onRemove(index)}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          >
            <X className="h-3 w-3" />
          </button>
        </motion.div>
      ))}
    </motion.div>
  );
}
