import { Message } from "@/types/messages";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Check, CheckCheck, Clock, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export interface UserMessageProps {
  message: Message;
  onDelete?: () => Promise<void>;
  onSelect?: () => void;
}

export function UserMessage({ message, onDelete, onSelect }: UserMessageProps) {
  const { profile } = useProfile();
  const isOwnMessage = message.sender_id === profile?.id;

  const getMessageStatus = () => {
    if (isOwnMessage) {
      if (message.read) {
        return <CheckCheck className="h-4 w-4 text-primary" />;
      } else {
        return <Check className="h-4 w-4 text-muted-foreground" />;
      }
    }
    return null;
  };

  const formattedTime = format(new Date(message.created_at), 'HH:mm', { locale: fr });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full gap-4 p-4 cursor-pointer group",
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      )}
      onClick={onSelect}
    >
      <Avatar className={cn(
        "h-10 w-10 ring-2",
        isOwnMessage ? "ring-primary" : "ring-muted"
      )}>
        <img
          src={message.sender.avatar_url || "/user-icon.svg"}
          alt="User avatar"
          className="h-full w-full object-cover rounded-full"
        />
      </Avatar>
      
      <div className={cn(
        "flex flex-col gap-1 max-w-[70%]",
        isOwnMessage ? "items-end" : "items-start"
      )}>
        <p className="text-sm font-medium text-muted-foreground">
          {message.sender.full_name}
        </p>
        
        <div className="flex items-end gap-2">
          <Card className={cn(
            "p-4 relative group",
            isOwnMessage 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted"
          )}>
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
            <div className="flex items-center gap-1 mt-1 text-xs opacity-70">
              <Clock className="h-3 w-3" />
              <span>{formattedTime}</span>
              {getMessageStatus()}
            </div>
          </Card>
          
          {isOwnMessage && onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}