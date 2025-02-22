
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
  conversation: any;
  isSelected: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Conversation</DialogTitle>
      </DialogHeader>
      <button
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-3 p-4 hover:bg-muted transition-colors",
          isSelected && "bg-primary/10"
        )}
      >
        <div className="flex-1">
          <h4 className="font-medium text-sm">{conversation.title}</h4>
          {conversation.lastMessage && (
            <p className="text-sm text-muted-foreground truncate">
              {conversation.lastMessage}
            </p>
          )}
        </div>
      </button>
    </DialogContent>
  );
}
