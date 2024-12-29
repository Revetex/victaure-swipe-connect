import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { ChatHeader } from "./chat/ChatHeader";
import { ScrollArea } from "./ui/scroll-area";

export function Messages() {
  const { messages, sendMessage, handleJobResponse, isCreatingJob } = useChat();

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              onResponse={isCreatingJob ? handleJobResponse : undefined}
            />
          ))}
        </div>
      </ScrollArea>
      <ChatInput onSend={sendMessage} />
    </div>
  );
}