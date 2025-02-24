
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChatMessage {
  content: string;
  isUser: boolean;
  username?: string;
}

interface UseChatMessagesProps {
  context: string;
  maxQuestions: number;
  user: any;
  onMaxQuestionsReached?: () => void;
}

export function useChatMessages({ 
  context, 
  maxQuestions, 
  user, 
  onMaxQuestionsReached 
}: UseChatMessagesProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userQuestions, setUserQuestions] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const greetUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Sending initial greeting...");

        const { data, error } = await supabase.functions.invoke("victaure-chat", {
          body: { 
            messages: [
              { role: "system", content: context },
              { role: "user", content: "Bonjour !" }
            ],
            userId: user?.id
          }
        });

        if (error) throw error;
        console.log("Initial response:", data);

        if (data?.choices?.[0]?.message?.content) {
          setMessages([{
            content: data.choices[0].message.content,
            isUser: false
          }]);
        }
      } catch (error) {
        console.error("Error getting initial message:", error);
        setError(error as Error);
        toast.error("Désolé, je ne suis pas disponible pour le moment");
      } finally {
        setIsLoading(false);
      }
    };

    greetUser();
  }, [context, user?.id]);

  const sendMessage = async (userInput: string) => {
    if (userQuestions >= maxQuestions && !user) {
      onMaxQuestionsReached?.();
      return null;
    }

    if (!userInput.trim() || isLoading) return null;

    const userMessage = {
      content: userInput.trim(),
      isUser: true,
      username: user?.email || 'Visiteur'
    };

    try {
      setIsLoading(true);
      setError(null);
      console.log("Sending message to assistant...");
      
      // Add user message immediately
      setMessages(prev => [...prev, userMessage]);
      setUserQuestions(prev => prev + 1);

      const messageHistory = [
        { role: "system", content: context },
        ...messages.map(msg => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.content
        })),
        { role: "user", content: userInput }
      ];

      console.log("Message history:", messageHistory);

      const { data, error } = await supabase.functions.invoke("victaure-chat", {
        body: { 
          messages: messageHistory,
          userId: user?.id
        }
      });

      if (error) throw error;
      console.log("Assistant response:", data);

      if (data?.choices?.[0]?.message?.content) {
        const response = data.choices[0].message.content;
        setMessages(prev => [...prev, {
          content: response,
          isUser: false
        }]);
        return response;
      }
      return null;
    } catch (error) {
      console.error("Error in chat:", error);
      setError(error as Error);
      toast.error("Désolé, je ne peux pas répondre pour le moment");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    userQuestions,
    error
  };
}
