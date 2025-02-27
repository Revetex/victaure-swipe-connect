
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Send, MessageCircle, Brain, Info } from "lucide-react";
import { MessageList } from "./MessageList";
import { ChatHeader } from "./ChatHeader";
import { useVictaureChat } from "@/hooks/useVictaureChat";
import { QuickSuggestions } from "./QuickSuggestions";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";

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
    <Card className="flex flex-col h-[400px] bg-gradient-to-br from-[#1B2A4A]/90 to-[#1A1F2C]/90 backdrop-blur-xl rounded-xl border-2 border-[#64B5D9]/20 overflow-hidden shadow-xl">
      <ChatHeader 
        title={
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#64B5D9]" />
            <span>Assistant Virtuel</span>
          </div>
        }
        subtitle={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm text-[#F1F0FB]/70"
          >
            <MessageCircle className="w-4 h-4" />
            <span>
              {questionsLeft} question{questionsLeft > 1 ? 's' : ''} restante{questionsLeft > 1 ? 's' : ''}
            </span>
          </motion.div>
        }
      />
      
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <div className="flex flex-col justify-between h-full">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <MessageList messages={messages} />
            
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-[#64B5D9]/10 rounded-lg border border-[#64B5D9]/20"
              >
                <Info className="w-5 h-5 text-[#64B5D9]" />
                <p className="text-sm text-[#F1F0FB]/80">
                  Je suis là pour vous aider dans votre inscription. N'hésitez pas à me poser vos questions !
                </p>
              </motion.div>
            )}
          </div>
          
          <div className="p-4 border-t border-[#F1F0FB]/10 space-y-4 bg-[#1B2A4A]/50">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <QuickSuggestions 
                  onSelect={(suggestion) => {
                    sendMessage(suggestion);
                  }}
                  suggestions={[
                    "Comment fonctionne l'inscription ?",
                    "Quels sont les avantages ?",
                    "Comment puis-je vous contacter ?",
                    "Quelle est la politique de confidentialité ?"
                  ]}
                />
              </motion.div>
            </AnimatePresence>
            
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Posez votre question..."
                disabled={isLoading || questionsLeft === 0}
                className="flex-1 bg-[#1A1F2C]/50 border-[#64B5D9]/20 text-[#F1F0FB] placeholder:text-[#F1F0FB]/30 focus:ring-2 focus:ring-[#64B5D9]/30"
              />
              <Button
                type="submit"
                disabled={isLoading || questionsLeft === 0 || !inputValue.trim()}
                className="bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-white transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>

            {questionsLeft === 0 && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-[#F1F0FB]/60 text-center"
              >
                Vous avez atteint la limite de questions. N'hésitez pas à vous inscrire pour continuer la conversation.
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
