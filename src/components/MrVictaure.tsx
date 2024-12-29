import { ChatHeader } from "./chat/ChatHeader";
import { ChatInput } from "./chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { ChatContainer } from "./chat/ChatContainer";
import { MaximizeButton } from "./chat/MaximizeButton";

export function MrVictaure() {
  const { t } = useTranslation();
  const {
    messages,
    inputMessage,
    isListening,
    isThinking,
    setMessages,
    setInputMessage,
    handleSendMessage: originalHandleSendMessage,
    handleVoiceInput,
    clearChat,
  } = useChat();

  const { profile, setProfile, tempProfile, setTempProfile } = useProfile();
  const [isMaximized, setIsMaximized] = useState(false);

  const handleSendMessage = async (message: string) => {
    try {
      const response = await originalHandleSendMessage(message, profile);
      
      if (response.includes('"action":"UPDATE_VCARD"')) {
        try {
          const jsonStartIndex = response.indexOf('{');
          const jsonEndIndex = response.lastIndexOf('}') + 1;
          const jsonStr = response.substring(jsonStartIndex, jsonEndIndex);
          const updateData = JSON.parse(jsonStr);

          if (updateData.action === "UPDATE_VCARD" && updateData.changes) {
            const newProfile = { ...profile, ...updateData.changes };
            setTempProfile(newProfile);
            setProfile(newProfile);
            toast.success(t("vcard.updateSuccess"));
          }
        } catch (error) {
          console.error("Error parsing VCard update:", error);
        }
      }
      
      if (response.includes('"action":"CREATE_JOB"')) {
        try {
          const jsonStartIndex = response.indexOf('{');
          const jsonEndIndex = response.lastIndexOf('}') + 1;
          const jsonStr = response.substring(jsonStartIndex, jsonEndIndex);
          const jobData = JSON.parse(jsonStr);

          if (jobData.action === "CREATE_JOB" && jobData.job) {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not authenticated");

            const { error: jobError } = await supabase
              .from('jobs')
              .insert({
                ...jobData.job,
                employer_id: user.id,
                status: 'open'
              });

            if (jobError) throw jobError;
            toast.success(t("jobs.createSuccess"));
          }
        } catch (error) {
          console.error("Error creating job:", error);
          toast.error(t("jobs.createError"));
        }
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      toast.error(t("error.generic"));
    }
  };

  return (
    <div 
      className={cn(
        "glass-card flex flex-col relative overflow-hidden transition-all duration-300",
        isMaximized ? "fixed inset-4 z-50" : "h-[500px]"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-victaure-blue/5 to-transparent pointer-events-none" />
      
      <ChatHeader isThinking={isThinking} onClearChat={clearChat} />

      <ChatContainer messages={messages} isThinking={isThinking} />

      <div className="p-4 pt-0">
        <ChatInput
          value={inputMessage}
          onChange={setInputMessage}
          onSend={() => handleSendMessage(inputMessage)}
          onVoiceInput={handleVoiceInput}
          isListening={isListening}
          isThinking={isThinking}
        />
      </div>

      <MaximizeButton 
        isMaximized={isMaximized}
        onToggle={() => setIsMaximized(!isMaximized)}
      />
    </div>
  );
}