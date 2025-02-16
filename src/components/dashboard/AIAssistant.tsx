import { useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AIAssistantHeader } from "./ai/AIAssistantHeader";
import { AIAssistantStatus } from "./ai/AIAssistantStatus";
import { AIAssistantInput } from "./ai/AIAssistantInput";
import { AIMessageList } from "./ai/AIMessageList";
import { ArrowDown, Mic, MicOff, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface AIAssistantProps {
  onClose: () => void;
}

interface AIResponse {
  response: string;
  suggestedJobs?: any[];
}

export function AIAssistant({ onClose }: AIAssistantProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: string; content: any }>>([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { profile } = useProfile();
  const abortController = useRef<AbortController | null>(null);

  const { isListening, startListening, stopListening, hasRecognitionSupport } = 
    useSpeechRecognition({
      onResult: (transcript) => {
        setInput(transcript);
      },
    });

  const handleFileDrop = useCallback(async (files: FileList) => {
    if (!files.length) return;
    const file = files[0];
    
    try {
      setIsLoading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('ai-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('ai_file_uploads')
        .insert({
          file_name: file.name,
          file_type: file.type,
          file_path: filePath,
          user_id: profile?.id
        });

      if (dbError) throw dbError;

      setMessages(prev => [...prev, {
        type: 'user',
        content: { 
          message: `J'ai uploadé le fichier: ${file.name}`,
          fileInfo: {
            name: file.name,
            type: file.type,
            path: filePath
          }
        }
      }]);

      toast.success("Fichier téléchargé avec succès");
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error("Erreur lors du téléchargement du fichier");
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileDrop(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileDrop(e.target.files);
    }
  };

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }
  }, []);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setIsThinking(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour utiliser l'assistant");
        return;
      }

      // Cancel any previous ongoing request
      if (abortController.current) {
        abortController.current.abort();
      }

      // Create a new abort controller for this request
      abortController.current = new AbortController();

      // Add user message to the conversation
      const userMessage = { type: 'user', content: { message: input } };
      setMessages(prev => [...prev, userMessage]);
      setInput("");
      setIsTyping(true);
      scrollToBottom();
      
      // Call AI assistant function with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 30000);
      });

      const response = await supabase.functions.invoke<AIResponse>('ai-chat', {
        body: { 
          message: input,
          userId: user.id,
          context: {
            previousMessages: messages.slice(-5),
            userProfile: profile,
          }
        }
      });

      const result = await Promise.race([Promise.resolve(response), timeoutPromise]);
      
      if (!result?.data?.response) {
        throw new Error('Invalid response format from AI');
      }

      const assistantMessage = { 
        type: 'assistant', 
        content: {
          message: result.data.response,
          suggestedJobs: result.data.suggestedJobs || []
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      scrollToBottom();

    } catch (error: any) {
      console.error('Error:', error);
      if (error.name === 'AbortError') {
        toast.error("La requête a été annulée");
      } else if (error.message === 'Timeout') {
        toast.error("La requête a pris trop de temps, veuillez réessayer");
      } else {
        toast.error("Une erreur est survenue lors de la communication avec l'assistant");
      }
    } finally {
      setIsLoading(false);
      setIsThinking(false);
      setIsTyping(false);
      abortController.current = null;
    }
  }, [input, isLoading, messages, profile, scrollToBottom]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6 lg:p-8"
    >
      <Card 
        className="max-w-2xl mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-gray-200 dark:border-gray-800 shadow-lg"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <AIAssistantHeader onClose={onClose} />

        <AIMessageList 
          messages={messages}
          onScroll={handleScroll}
          messagesEndRef={messagesEndRef}
        />

        <AnimatePresence>
          {showScrollButton && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed bottom-24 right-4"
            >
              <Button
                size="icon"
                className="rounded-full shadow-lg bg-primary hover:bg-primary/90"
                onClick={scrollToBottom}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <AIAssistantStatus 
          isThinking={isThinking}
          isTyping={isTyping}
          isListening={isListening}
        />

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex gap-2 mb-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <File className="h-4 w-4" />
            </Button>
            {hasRecognitionSupport && (
              <Button
                variant="outline"
                size="icon"
                onClick={isListening ? stopListening : startListening}
                className={isListening ? "bg-red-100 hover:bg-red-200 dark:bg-red-900" : ""}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4 text-red-500" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          <AIAssistantInput
            input={input}
            isLoading={isLoading}
            onInputChange={setInput}
            onSubmit={handleSubmit}
          />
        </div>
      </Card>
    </motion.div>
  );
}
