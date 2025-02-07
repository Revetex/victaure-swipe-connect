
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Message } from "@/types/messages";

interface AssistantButtonProps {
  chatMessages: Message[];
  onSelect: () => void;
}

export function AssistantButton({ chatMessages, onSelect }: AssistantButtonProps) {
  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        className="w-full flex items-center gap-2 h-auto p-4 bg-primary/5 hover:bg-primary/10"
        onClick={onSelect}
      >
        <Avatar className="h-12 w-12 ring-2 ring-primary/20">
          <AvatarImage 
            src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png" 
            alt="M. Victaure" 
          />
          <AvatarFallback>MV</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-left">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-lg text-primary">M. Victaure</h3>
            {chatMessages.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {format(new Date(chatMessages[chatMessages.length - 1].created_at), 'PP', { locale: fr })}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">Assistant virtuel</p>
        </div>
      </Button>
    </div>
  );
}
