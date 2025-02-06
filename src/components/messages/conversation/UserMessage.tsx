import { Message } from "@/types/messages";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export interface UserMessageProps {
  message: Message;
  onDelete?: () => Promise<void>;
}

export function UserMessage({ message, onDelete }: UserMessageProps) {
  const { profile } = useProfile();
  const isOwnMessage = message.sender_id === profile?.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full gap-4 p-4",
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      )}
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
        "flex flex-col gap-1",
        isOwnMessage ? "items-end" : "items-start"
      )}>
        <p className="text-sm font-medium text-muted-foreground">
          {message.sender.full_name}
        </p>
        
        <div className="flex items-start gap-2">
          <Card className={cn(
            "p-4",
            isOwnMessage 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted"
          )}>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </Card>
          
          {isOwnMessage && onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}