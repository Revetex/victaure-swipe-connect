
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FriendsListProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FriendsList({ isOpen, onClose }: FriendsListProps) {
  if (!isOpen) return null;

  return (
    <motion.aside
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.2 }}
      className="fixed right-0 top-0 h-screen w-[300px] bg-background border-l p-4 shadow-lg z-50"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Amis</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-5rem)]">
        {/* Le contenu de la liste des amis sera ajouté ici */}
        <p className="text-muted-foreground text-sm">
          Aucun ami pour le moment
        </p>
      </div>
    </motion.aside>
  );
}
