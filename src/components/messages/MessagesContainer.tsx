
import { useReceiver } from "@/hooks/useReceiver";
import { Card } from "@/components/ui/card";
import { ConversationList } from "./conversation/ConversationList";
import { ConversationView } from "./conversation/ConversationView";
import { cn } from "@/lib/utils";

export function MessagesContainer() {
  const { receiver, showConversation } = useReceiver();

  return (
    <Card className={cn(
      "fixed inset-0 top-16 flex h-[calc(100vh-4rem)] w-full",
      "border-0 rounded-none bg-[#1C1C1C] overflow-hidden"
    )}>
      <ConversationList 
        className={cn(
          "border-r border-[#3C3C3C]/20 bg-[#2C2C2C]/50 backdrop-blur-sm",
          showConversation ? "hidden md:flex md:w-80" : "w-full md:w-80"
        )}
      />
      
      {(showConversation || receiver) && (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#1C1C1C]">
          <ConversationView />
        </div>
      )}
    </Card>
  );
}
