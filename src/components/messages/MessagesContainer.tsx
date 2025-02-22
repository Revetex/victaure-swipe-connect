
import { useReceiver } from "@/hooks/useReceiver";
import { Card } from "@/components/ui/card";
import { ConversationList } from "./conversation/ConversationList";
import { ConversationView } from "./conversation/ConversationView";

export function MessagesContainer() {
  const { receiver, showConversation } = useReceiver();

  return (
    <Card className="fixed inset-0 flex h-screen w-full border-0 rounded-none">
      <ConversationList 
        className={
          showConversation 
            ? "hidden md:flex md:w-80 border-r" 
            : "w-full md:w-80 border-r"
        } 
      />
      
      {(showConversation || receiver) && (
        <div className="flex-1 flex flex-col h-full">
          <ConversationView />
        </div>
      )}
    </Card>
  );
}
