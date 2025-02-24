
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Message } from "@/types/messages";

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
  const [messages, setMessages] = useState<Message[]>([]);
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
          const initialMessage: Message = {
            id: crypto.randomUUID(),
            content: data.choices[0].message.content,
            sender_id: "assistant",
            receiver_id: user?.id || "anonymous",
            created_at: new Date().toISOString(),
            sender: {
              id: "assistant",
              email: "assistant@victaure.ai",
              full_name: "Mr. Victaure",
              avatar_url: null,
              role: "admin",
              certifications: [],
              education: [],
              experiences: [],
              friends: []
            },
            isUser: false
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

    greetUser();
  }, [context, user?.id]);

  const sendMessage = async (userInput: string) => {
    if (userQuestions >= maxQuestions && !user) {
      onMaxQuestionsReached?.();
      return null;
    }

    if (!userInput.trim() || isLoading) return null;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: userInput.trim(),
      sender_id: user?.id || "anonymous",
      receiver_id: "assistant",
      created_at: new Date().toISOString(),
      sender: {
        id: user?.id || "anonymous",
        email: user?.email || "visitor@victaure.ai",
        full_name: user?.email || "Visiteur",
        avatar_url: null,
        role: "professional",
        certifications: [],
        education: [],
        experiences: [],
        friends: []
      },
      isUser: true
    };

    setUserQuestions(prev => prev + 1);
    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      setIsLoading(true);
      console.log("Sending message to assistant...");
      
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
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          content: data.choices[0].message.content,
          sender_id: "assistant",
          receiver_id: user?.id || "anonymous",
          created_at: new Date().toISOString(),
          sender: {
            id: "assistant",
            email: "assistant@victaure.ai",
            full_name: "Mr. Victaure",
            avatar_url: null,
            role: "admin",
            certifications: [],
            education: [],
            experiences: [],
            friends: []
          },
          isUser: false
        };
        setMessages(prevMessages => [...prevMessages, assistantMessage]);
        return assistantMessage.content;
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
