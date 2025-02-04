import { useState } from "react";
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    if (onDeleteConversation) {
      onDeleteConversation();
      toast.success("Conversation supprimée avec succès");
    }
    setShowDeleteDialog(false);
  };

  return (
    <div className="flex flex-col h-full">
      <ConversationHeader
        profile={profile}
        onBack={onBack || (() => {})}
        onDeleteConversation={() => setShowDeleteDialog(true)}
      />

      <div className="flex-1 overflow-y-auto">
        <ConversationMessages
          messages={messages}
          isThinking={isThinking}
        />
      </div>

      <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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