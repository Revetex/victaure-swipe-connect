import { useReceiver } from "@/hooks/useReceiver";
import { Card } from "@/components/ui/card";
import { ConversationList } from "./conversation/ConversationList";
import { ConversationView } from "./conversation/ConversationView";
import { cn } from "@/lib/utils";
export function MessagesContainer() {
  const {
    receiver,
    showConversation
  } = useReceiver();
  return <Card className="">
      <ConversationList className={cn("border-r border-[#64B5D9]/10 bg-[#1B2A4A]/50", showConversation ? "hidden md:flex md:w-80" : "w-full md:w-80")} />
      
      {(showConversation || receiver) && <div className="flex-1 flex flex-col h-full overflow-hidden">
          <ConversationView />
        </div>}
    </Card>;
}