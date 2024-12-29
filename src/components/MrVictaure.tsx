import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { useChat, Message } from "@/hooks/useChat";
import { useState, useRef, useEffect } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function MrVictaure() {
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        content: "Bonjour! Je suis Mr. Victaure, votre assistant personnel proactif. Je peux vous aider à créer votre profil professionnel et à publier des offres de mission. Souhaitez-vous que je vous aide à créer une nouvelle mission ou à améliorer votre profil ?",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length, setMessages]);

  const handleSendMessage = async (message: string) => {
    try {
      const response = await originalHandleSendMessage(message, profile);
      
      // Check if the response contains a VCard update action
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
            toast.success("Profil mis à jour avec succès");
          }
        } catch (error) {
          console.error("Error parsing VCard update:", error);
        }
      }
      
      // Check if the response contains a job creation action
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
            toast.success("Mission créée avec succès");
          }
        } catch (error) {
          console.error("Error creating job:", error);
          toast.error("Erreur lors de la création de la mission");
        }
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      toast.error("Une erreur est survenue");
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
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

      <div 
        ref={scrollAreaRef}
        className="flex-grow overflow-y-auto mb-4 px-4 scrollbar-thin scrollbar-thumb-victaure-blue/20 scrollbar-track-transparent"
      >
        <div className="space-y-4 py-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              sender={message.sender}
              thinking={message.thinking}
              showTimestamp={
                index === 0 || 
                messages[index - 1]?.sender !== message.sender ||
                new Date(message.timestamp).getTime() - new Date(messages[index - 1]?.timestamp).getTime() > 300000
              }
              timestamp={message.timestamp}
            />
          ))}
        </div>
      </div>

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

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMaximize}
        className="absolute top-4 right-4 hover:bg-victaure-blue/10"
      >
        {isMaximized ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}