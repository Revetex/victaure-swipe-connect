import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

interface AssistantHeaderProps {
  isThinking: boolean;
}

export function AssistantHeader({ isThinking }: AssistantHeaderProps) {
  return (
    <div className="flex items-center gap-3 p-4 border-b">
      <Avatar className="h-10 w-10">
        <AvatarImage src="/bot-avatar.png" alt="Mr. Victaure" />
        <AvatarFallback className="bg-victaure-blue/20">
          <Bot className="h-5 w-5 text-victaure-blue" />
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-lg font-semibold">Mr. Victaure</h2>
        <p className="text-sm text-muted-foreground">
          {isThinking ? "En train de réfléchir..." : "Assistant IA Personnel"}
        </p>
      </div>
    </div>
  );
}