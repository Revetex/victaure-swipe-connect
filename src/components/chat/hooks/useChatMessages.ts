
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

        let profile = null;
        
        // Ne récupérer le profil que si l'utilisateur est connecté
        if (user?.id) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .maybeSingle();

          if (profileError) {
            console.error("Error fetching profile:", profileError);
            // Ne pas afficher de toast pour les erreurs de profil pour les invités
            if (user?.id) {
              toast.error("Erreur lors de la récupération du profil");
            }
            return;
          }
          profile = profileData;
        }

        const { data, error } = await supabase.functions.invoke("victaure-chat", {
          body: { 
            messages: [
              { role: "system", content: context },
              { role: "user", content: "Bonjour !" }
            ],
            userId: user?.id,
            userProfile: profile
          }
        });

        if (error) {
          console.error("Error in greetUser:", error);
          setError(error);
          toast.error("Mr Victaure n'est pas disponible pour le moment");
          return;
        }

        console.log("Initial response data:", data);

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

    // Toujours déclencher le message d'accueil, que l'utilisateur soit connecté ou non
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
      console.log("Sending message, current state:", { userQuestions, maxQuestions });

      // Add user message immediately
      setMessages(prev => [...prev, userMessage]);
      setUserQuestions(prev => prev + 1);

      let profile = null;
      
      // Ne récupérer le profil que si l'utilisateur est connecté
      if (user?.id) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user?.id)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          // Ne pas afficher de toast pour les erreurs de profil pour les invités
          if (user?.id) {
            toast.error("Erreur lors de la récupération du profil");
          }
          return null;
        }
        profile = profileData;
      }

      const messageHistory = [
        { role: "system", content: context },
        ...messages.map(msg => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.content
        })),
        { role: "user", content: userInput }
      ];

      console.log("Sending to victaure-chat with history:", messageHistory);

      const { data, error } = await supabase.functions.invoke("victaure-chat", {
        body: { 
          messages: messageHistory,
          userId: user?.id,
          userProfile: profile
        }
      });

      if (error) {
        console.error("Error in sendMessage:", error);
        setError(error);
        toast.error("Mr Victaure n'est pas disponible pour le moment");
        return null;
      }

      console.log("Response from victaure-chat:", data);

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
      console.error("Error in sendMessage:", error);
      setError(error as Error);
      toast.error("Une erreur est survenue lors de l'envoi du message");
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
