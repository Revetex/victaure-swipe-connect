import { X } from "lucide-react";
import { formatTime } from "@/utils/dateUtils";
import { motion } from "framer-motion";

interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  onDelete: (id: string) => void;
}

export function NotificationItem({
  id,
  title,
  message,
  created_at,
  read,
  onDelete,
}: NotificationItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-4 rounded-lg relative group transition-all duration-200 hover:scale-[1.02] ${
        read
          ? "bg-muted/50"
          : "bg-primary/10 border-l-2 border-primary shadow-sm"
      }`}
    >
      <button
        onClick={() => onDelete(id)}
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Supprimer la notification"
      >
        <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
      </button>
      <div className="flex justify-between items-start pr-6">
        <h3 className="font-medium text-sm md:text-base">{title}</h3>
        <span className="text-xs text-muted-foreground">
          {formatTime(created_at)}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{message}</p>
    </motion.div>
  );
}