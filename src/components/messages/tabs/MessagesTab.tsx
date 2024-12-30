import { MessageSquare } from "lucide-react";
import { MessageList } from "../MessageList";
import { useMessages } from "@/hooks/useMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import { useProfile } from "@/hooks/useProfile";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AssistantHeader } from "../AssistantHeader";
import { AssistantMessageItem } from "../AssistantMessageItem";
import { ChatArea } from "../ChatArea";

export function MessagesTab() {
  const { messages: userMessages, isLoading, markAsRead } = useMessages();
  const { profile } = useProfile();
  const [isAssistantChatOpen, setIsAssistantChatOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const {
    messages: chatMessages,
    inputMessage,
    isListening,
    isThinking,
    setInputMessage,
    handleSendMessage,
    handleVoiceInput,
  } = useChat();

  const lastAssistantMessage = chatMessages[chatMessages.length - 1]?.content || "Comment puis-je vous aider ?";

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [chatMessages]);
  
  return (
    <div className="space-y-4">
      <AssistantMessageItem 
        lastMessage={lastAssistantMessage}
        onClick={() => setIsAssistantChatOpen(true)}
      />

      <Dialog open={isAssistantChatOpen} onOpenChange={setIsAssistantChatOpen}>
        <DialogContent className="sm:max-w-[500px] h-[80vh] flex flex-col p-0">
          <AssistantHeader isThinking={isThinking} />

          <ChatArea 
            messages={chatMessages}
            scrollAreaRef={scrollAreaRef}
          />

          <div className="p-4 border-t">
            <ChatInput
              value={inputMessage}
              onChange={setInputMessage}
              onSend={() => handleSendMessage(inputMessage, profile)}
              onVoiceInput={handleVoiceInput}
              isListening={isListening}
              isThinking={isThinking}
            />
          </div>
        </DialogContent>
      </Dialog>

      <div>
        <div className="flex items-center gap-2 text-primary mb-4">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>
        <MessageList
          messages={userMessages}
          isLoading={isLoading}
          onMarkAsRead={(messageId) => markAsRead.mutate(messageId)}
        />
      </div>
    </div>
  );
}