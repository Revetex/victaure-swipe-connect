
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Send } from "lucide-react";
import { MessageList } from "./MessageList";
import { ChatHeader } from "./ChatHeader";
import { useVictaureChat } from "@/hooks/useVictaureChat";
import { QuickSuggestions } from "./QuickSuggestions";

interface AuthChatProps {
  maxQuestions?: number;
  context?: string;
}

export function AuthChat({ maxQuestions = 3, context }: AuthChatProps) {
  const [inputValue, setInputValue] = useState("");
  const { sendMessage, isLoading, messages, questionsLeft } = useVictaureChat({ maxQuestions, context });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    sendMessage(inputValue);
    setInputValue("");
  };

  return (
    <div className="flex flex-col h-[600px] bg-[#1B2A4A]/90 backdrop-blur-xl rounded-xl border-2 border-[#F1F0FB]/10 overflow-hidden">
      <ChatHeader 
        title="Assistant d'Inscription"
        subtitle={`${questionsLeft} question${questionsLeft > 1 ? 's' : ''} restante${questionsLeft > 1 ? 's' : ''}`}
      />
      
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <div className="flex flex-col justify-between h-full">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <MessageList messages={messages.map((msg, index) => ({
              id: `msg-${index}`,
              content: msg.content,
              sender_id: msg.role === 'user' ? 'user' : 'assistant',
              receiver_id: msg.role === 'user' ? 'assistant' : 'user',
              created_at: new Date().toISOString(),
              is_assistant: msg.role === 'assistant',
              sender: {
                id: msg.role === 'user' ? 'user' : 'assistant',
                full_name: msg.role === 'user' ? 'Vous' : 'Assistant',
                role: 'professional'
              }
            }))} />
          </div>
          
          <div className="p-4 border-t border-[#F1F0FB]/10 space-y-4">
            <QuickSuggestions 
              onSelect={(suggestion) => {
                sendMessage(suggestion);
              }}
              suggestions={[
                "Comment fonctionne l'inscription ?",
                "Quels sont les avantages ?",
                "Comment puis-je vous contacter ?"
              ]}
            />
            
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Posez votre question..."
                disabled={isLoading || questionsLeft === 0}
                className="flex-1 bg-[#1A1F2C]/50 border-[#64B5D9]/20 text-[#F1F0FB] placeholder:text-[#F1F0FB]/30"
              />
              <Button
                type="submit"
                disabled={isLoading || questionsLeft === 0 || !inputValue.trim()}
                className="bg-gradient-to-r from-[#64B5D9] to-[#4A90E2] hover:opacity-90 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
