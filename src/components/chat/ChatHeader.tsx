import { ArrowLeft, Bot, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatHeaderProps {
  onBack?: () => void;
  onDelete?: () => void;
  isThinking?: boolean;
  showingChat?: boolean;
}

export function ChatHeader({ onBack, onDelete, isThinking, showingChat }: ChatHeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png" alt="Mr. Victaure" />
            <AvatarFallback className="bg-primary/20">
              <Bot className="h-5 w-5 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold truncate">Mr. Victaure</h2>
            <p className="text-sm text-muted-foreground truncate">
              {isThinking ? "En train de réfléchir..." : "Assistant IA Personnel"}
            </p>
          </div>
        </div>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </header>
  );
}