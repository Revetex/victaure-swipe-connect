import { useState, useRef } from "react";
import { Message } from "@/types/messages";
import { ChatInput } from "@/components/chat/ChatInput";
import { UserProfile } from "@/types/profile";
import { ConversationHeader } from "./ConversationHeader";
import { ConversationMessages } from "./ConversationMessages";
import { DeleteDialog } from "./DeleteDialog";
import { toast } from "sonner";

interface ConversationViewProps {
  messages: Message[];
  profile: UserProfile | null;
  isThinking?: boolean;
  isListening?: boolean;
  inputMessage: string;
  onInputChange: (value: string) => void;
  onSendMessage: (message: string) => void;
  onVoiceInput?: () => void;
  onBack?: () => void;
  onDeleteConversation?: () => void;
}

export function ConversationView({
  messages,
  profile,
  isThinking,
  isListening,
  inputMessage,
  onInputChange,
  onSendMessage,
  onVoiceInput,
  onBack,
  onDeleteConversation
}: ConversationViewProps) {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleScroll = () => {
    const element = document.querySelector('.overflow-y-auto');
    if (!element) return;
    
    const { scrollTop, scrollHeight, clientHeight } = element;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setShowScrollButton(!isNearBottom);
    setIsAutoScrollEnabled(isNearBottom);
  };

  const handleScrollToBottom = () => {
    const element = document.querySelector('.overflow-y-auto');
    if (!element) return;
    
    setIsAutoScrollEnabled(true);
    element.scrollTop = element.scrollHeight;
  };

  const handleDelete = () => {
    if (onDeleteConversation) {
      onDeleteConversation();
      toast.success("Conversation supprimée avec succès");
    }
    setShowDeleteDialog(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-background">
      <ConversationHeader
        profile={profile}
        onBack={onBack || (() => {})}
        onDeleteConversation={() => setShowDeleteDialog(true)}
      />

      <ConversationMessages
        messages={messages}
        isThinking={isThinking}
        showScrollButton={showScrollButton}
        onScroll={handleScroll}
        onScrollToBottom={handleScrollToBottom}
      />

      <div className="sticky bottom-0 shrink-0 border-t bg-background/95 backdrop-blur-sm p-4">
        <ChatInput
          value={inputMessage}
          onChange={onInputChange}
          onSend={() => onSendMessage(inputMessage)}
          onVoiceInput={onVoiceInput}
          isListening={isListening}
          isThinking={isThinking}
          placeholder="Écrivez votre message..."
          className="w-full"
        />
      </div>

      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
      />
    </div>
  );
}