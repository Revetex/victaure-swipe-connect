
import { useReceiver } from "@/hooks/useReceiver";
import { Card } from "@/components/ui/card";
import { ConversationList } from "./conversation/ConversationList";
import { ConversationView } from "./conversation/ConversationView";

export function MessagesContainer() {
  const { receiver, showConversation } = useReceiver();

  return (
    <Card className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <ConversationList className={showConversation ? "hidden md:flex md:w-80" : "w-full md:w-80"} />
      
      {(showConversation || receiver) && (
        <div className="flex-1 flex flex-col">
          <ConversationView />
        </div>
      )}
    </Card>
  );
}
