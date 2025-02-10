
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";

interface ConversationItemProps {
  user: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  lastMessage: {
    content: string;
    created_at: string;
  };
  onSelect: () => void;
}

export function ConversationItem({ user, lastMessage, onSelect }: ConversationItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        variant="ghost"
        className="w-full flex items-center gap-2 h-auto p-4 hover:bg-muted/50"
        onClick={onSelect}
      >
        <Avatar className="h-12 w-12 ring-2 ring-muted">
          <AvatarImage src={user.avatar_url || undefined} alt={user.full_name} />
          <AvatarFallback>
            {user.full_name?.slice(0, 2).toUpperCase() || '??'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center w-full">
            <h3 className="font-medium text-base">{user.full_name}</h3>
            <span className="text-xs text-muted-foreground">
              {format(new Date(lastMessage.created_at), 'PP', { locale: fr })}
            </span>
          </div>
          <p className="text-sm text-muted-foreground truncate text-left mt-1">
            {lastMessage.content}
          </p>
        </div>
      </Button>
    </motion.div>
  );
}

