
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X, User, Bot } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { useJobsAI } from "@/hooks/useJobsAI";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
}

interface JobsAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JobsAIAssistant({ isOpen, onClose }: JobsAIAssistantProps) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isLoading, askAssistant } = useJobsAI({
    userProfile: user,
    jobContext: { /* Contexte des jobs à ajouter */ }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: query,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery("");

    try {
      const response = await askAssistant(query);
      if (response) {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          content: response,
          type: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-x-0 bottom-0 p-4 z-50"
        >
          <Card className="max-w-2xl mx-auto border border-primary/20 bg-black/90 backdrop-blur-xl shadow-xl">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    Assistant Victaure IA
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="h-[400px] overflow-y-auto p-4 space-y-4 rounded-lg bg-zinc-900/50">
                {messages.length === 0 ? (
                  <div className="text-center text-zinc-500 space-y-2">
                    <Sparkles className="h-8 w-8 mx-auto mb-2" />
                    <p>Je peux vous aider à :</p>
                    <ul className="space-y-1 text-sm">
                      <li>• Trouver des offres adaptées à votre profil</li>
                      <li>• Analyser les tendances du marché</li>
                      <li>• Optimiser votre CV et lettre de motivation</li>
                      <li>• Préparer vos entretiens</li>
                    </ul>
                  </div>
                ) : (
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${
                        message.type === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {message.type === 'user' ? (
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-zinc-400" />
                          </div>
                        )}
                      </div>
                      <div
                        className={`flex flex-col space-y-1 max-w-[80%] ${
                          message.type === 'user' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.type === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-zinc-800 text-zinc-100'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <span className="text-xs text-zinc-500">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Posez votre question..."
                  className="flex-1 bg-zinc-900/50 border-zinc-800 focus:border-primary/30"
                  disabled={isLoading}
                />
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary/80 hover:bg-primary text-white"
                >
                  {isLoading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </form>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
