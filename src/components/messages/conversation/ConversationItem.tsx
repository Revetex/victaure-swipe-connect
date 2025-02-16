
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { Circle } from "lucide-react";

interface ConversationItemProps {
  user: {
    id: string;
    full_name: string;
    avatar_url?: string;
    online_status?: boolean;
    last_seen?: string;
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
  const getOnlineStatus = () => {
    if (user.online_status) {
      return <Circle className="h-3 w-3 fill-green-500 text-green-500" />;
    }
    if (user.last_seen) {
      return <span className="text-xs text-muted-foreground">
        {format(new Date(user.last_seen), 'PP', { locale: fr })}
      </span>;
    }
    return null;
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
        onClick={onSelect}
      >
        <div className="relative">
          <Avatar className="h-12 w-12 ring-2 ring-primary/10">
            <AvatarImage 
              src={user.avatar_url || undefined} 
              alt={user.full_name || 'User'} 
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/5 text-primary">
              {user.full_name?.slice(0, 2).toUpperCase() || '??'}
            </AvatarFallback>
          </Avatar>
          {user.online_status && (
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-background bg-green-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center w-full">
            <h3 className="font-medium text-base truncate">
              {user.full_name || 'Unknown User'}
            </h3>
            <div className="flex items-center gap-2">
              {getOnlineStatus()}
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {format(new Date(lastMessage.created_at), 'HH:mm', { locale: fr })}
              </span>
            </div>
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
              onDelete();
            }}
          >
            Supprimer
          </Button>
        )}
      </Button>
    </motion.div>
  );
}
