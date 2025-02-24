
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ChatMessage } from "@/types/messages";

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

  useEffect(() => {
    const greetUser = async () => {
      try {
        setIsLoading(true);
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
          const initialMessage: ChatMessage = {
            role: "assistant",
            content: data.choices[0].message.content
          };
          setMessages([initialMessage]);
        }
      } catch (error) {
        console.error("Error getting initial message:", error);
        toast.error("Désolé, je ne suis pas disponible pour le moment");
      } finally {
        setIsLoading(false);
      }
    };

    if (context) {
      greetUser();
    }
  }, [context, user?.id]);

  const sendMessage = async (userInput: string) => {
    if (userQuestions >= maxQuestions && !user) {
      onMaxQuestionsReached?.();
      return null;
    }

    if (!userInput.trim() || isLoading) return null;

    const userMessage: ChatMessage = {
      role: "user",
      content: userInput.trim()
    };

    setUserQuestions(prev => prev + 1);
    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      setIsLoading(true);
      console.log("Sending message to assistant...");
      
      const messageHistory = [
        { role: "system", content: context },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        userMessage
      ];

      const { data, error } = await supabase.functions.invoke("victaure-chat", {
        body: { 
          messages: messageHistory,
          userId: user?.id
        }
      });

      if (error) throw error;
      console.log("Assistant response:", data);

      if (data?.choices?.[0]?.message?.content) {
        const response: ChatMessage = {
          role: "assistant",
          content: data.choices[0].message.content
        };
        setMessages(prevMessages => [...prevMessages, response]);
        return response.content;
      }
      return null;
    } catch (error) {
      console.error("Error in chat:", error);
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
    userQuestions
  };
}
