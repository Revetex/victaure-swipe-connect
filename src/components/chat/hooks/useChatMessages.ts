
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
          }
        });

        if (error) throw error;

        console.log("Initial response:", data);

        if (data?.choices?.[0]?.message?.content) {
          setMessages(prevMessages => [{
            content: data.choices[0].message.content,
            isUser: false
          }]);
        }
      } catch (error) {
        console.error("Error getting initial message:", error);
        toast.error("Désolé, je ne suis pas disponible pour le moment");
      } finally {
        setIsLoading(false);
      }
    };

    greetUser();
  }, [context]);

  const sendMessage = async (userInput: string) => {
    if (userQuestions >= maxQuestions && !user) {
      onMaxQuestionsReached?.();
      return null;
    }

    if (!userInput.trim() || isLoading) return null;

    const userMessage = userInput.trim();
    setUserQuestions(prev => prev + 1);
    setMessages(prevMessages => [
      {
        content: userMessage,
        isUser: true,
        username: user?.email || 'Visiteur'
      },
      ...prevMessages
    ]);

    try {
      setIsLoading(true);
      console.log("Sending message to assistant...");
      
      const messageHistory = [
        { role: "system", content: context },
        ...messages.map(msg => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.content
        })).reverse(),
        { role: "user", content: userMessage }
      ];

      console.log("Message history:", messageHistory);

      const { data, error } = await supabase.functions.invoke("victaure-chat", {
        body: { messages: messageHistory }
      });

      if (error) throw error;

      console.log("Assistant response:", data);

      if (data?.choices?.[0]?.message?.content) {
        const response = data.choices[0].message.content;
        setMessages(prevMessages => [
          { content: response, isUser: false },
          ...prevMessages
        ]);
        return response;
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
