
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ConversationItemProps {
  user: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  lastMessage: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  onSelect: () => void;
  onDelete?: () => void;
  canDelete?: boolean;
}

export function ConversationItem({ 
  user, 
  lastMessage, 
  onSelect,
  onDelete,
  canDelete 
}: ConversationItemProps) {
  const handleSelect = () => {
    try {
      onSelect();
    } catch (error) {
      console.error("Error selecting conversation:", error);
      toast.error("Erreur lors de la sélection de la conversation");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        variant="ghost"
        className="relative w-full flex items-center gap-4 h-auto p-4 hover:bg-muted/50"
        onClick={handleSelect}
      >
        <Avatar className="h-12 w-12 ring-2 ring-muted/50">
          <AvatarImage 
            src={user.avatar_url || undefined} 
            alt={user.full_name || 'User'} 
            className="object-cover"
          />
          <AvatarFallback className="bg-primary/5 text-primary">
            {user.full_name?.slice(0, 2).toUpperCase() || '??'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center w-full">
            <h3 className="font-medium text-base truncate">
              {user.full_name || 'Unknown User'}
            </h3>
            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
              {format(new Date(lastMessage.created_at), 'PP', { locale: fr })}
            </span>
          </div>
          <p className="text-sm text-muted-foreground truncate text-left mt-1">
            {lastMessage.content}
          </p>
        </div>
        {canDelete && onDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              try {
                onDelete();
                toast.success("Conversation supprimée");
              } catch (error) {
                console.error("Error deleting conversation:", error);
                toast.error("Erreur lors de la suppression de la conversation");
              }
            }}
          >
            Supprimer
          </Button>
        )}
      </Button>
    </motion.div>
  );
}
