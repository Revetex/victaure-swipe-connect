import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import type { StickyNote as StickyNoteType } from "@/types/todo";

interface StickyNoteProps {
  note: StickyNoteType;
  onDelete: () => void;
}

export function StickyNote({ note, onDelete }: StickyNoteProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`relative p-4 rounded-lg shadow-lg backdrop-blur-sm ${
        note.color === 'yellow' ? 'bg-yellow-100/90' :
        note.color === 'blue' ? 'bg-blue-100/90' :
        note.color === 'green' ? 'bg-green-100/90' :
        note.color === 'pink' ? 'bg-pink-100/90' :
        'bg-purple-100/90'
      } hover:shadow-xl transition-shadow duration-200`}
    >
      <p className="text-gray-800 whitespace-pre-wrap break-words">{note.text}</p>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
      </Button>
    </motion.div>
  );
}