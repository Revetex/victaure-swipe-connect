
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useVictaureChat } from "@/hooks/useVictaureChat";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

interface ChatMessage {
  content: string;
  isUser: boolean;
  username?: string;
}

interface VictaureChatProps {
  maxQuestions?: number;
  context?: string;
  onMaxQuestionsReached?: () => void;
}

export function VictaureChat({ 
  maxQuestions = 3, 
  context = "Tu es Mr. Victaure, un assistant professionnel spécialisé dans l'emploi et le recrutement. Tu es chaleureux, empathique et très professionnel.",
  onMaxQuestionsReached 
}: VictaureChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [userQuestions, setUserQuestions] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { sendMessage, isLoading } = useVictaureChat({
    onResponse: (response) => {
      console.log("Received response:", response);
    }
  });

  const startRecording = async () => {
    try {
      setIsRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result?.toString().split(",")[1];
          if (base64Audio) {
            try {
              const { data, error } = await supabase.functions.invoke("voice-to-text", {
                body: { audio: base64Audio }
              });
              if (error) throw error;
              setUserInput(data.text);
            } catch (error) {
              console.error("Speech to text error:", error);
              toast.error("Désolé, je n'ai pas pu comprendre votre message");
            }
          }
        };
      };

      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
      }, 5000);

    } catch (error) {
      console.error("Recording error:", error);
      toast.error("Impossible d'accéder au microphone");
      setIsRecording(false);
    }
  };

  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true);
      const { data, error } = await supabase.functions.invoke("text-to-voice", {
        body: { text, voice: "alloy" }
      });
      if (error) throw error;

      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      audio.onended = () => setIsSpeaking(false);
      await audio.play();
    } catch (error) {
      console.error("Text to speech error:", error);
      toast.error("Désolé, je ne peux pas parler pour le moment");
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  }, [messages]);

  useEffect(() => {
    const greetUser = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("victaure-chat", {
          body: { 
            messages: [
              {
                role: "system",
                content: context
              },
              {
                role: "user",
                content: "Bonjour !"
              }
            ],
            hideSystem: true
          }
        });

        if (error) throw error;

        if (data?.choices?.[0]?.message?.content) {
          setMessages(prevMessages => [{
            content: data.choices[0].message.content,
            isUser: false
          }]);
        }
      } catch (error) {
        console.error("Error getting initial message:", error);
        toast.error("Désolé, je ne suis pas disponible pour le moment");
      }
    };

    greetUser();
  }, [context]);

  const handleSendMessage = async () => {
    if (userQuestions >= maxQuestions && !user) {
      onMaxQuestionsReached?.();
      return;
    }

    if (!userInput.trim() || isLoading) return;

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
    setUserInput("");

    try {
      const messageHistory = [
        {
          role: "system",
          content: context
        },
        ...messages.map(msg => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.content
        })).reverse(),
        {
          role: "user",
          content: userMessage
        }
      ];

      const { data, error } = await supabase.functions.invoke("victaure-chat", {
        body: { 
          messages: messageHistory,
          hideSystem: true
        }
      });

      if (error) throw error;

      if (data?.choices?.[0]?.message?.content) {
        const response = data.choices[0].message.content;
        setMessages(prevMessages => [
          {
            content: response,
            isUser: false
          },
          ...prevMessages
        ]);
        speakText(response);
      }
    } catch (error) {
      console.error("Error in chat:", error);
      toast.error("Désolé, je ne peux pas répondre pour le moment");
    }
  };

  const isDisabled = userQuestions >= maxQuestions && !user;
  const disabledMessage = "Connectez-vous pour continuer...";

  return (
    <div className="w-full bg-[#1A1F2C] rounded-xl overflow-hidden border border-[#64B5D9]/20 shadow-lg relative">
      <ChatHeader />
      <MessageList ref={chatContainerRef} messages={messages} />
      <ChatInput
        userInput={userInput}
        setUserInput={setUserInput}
        isRecording={isRecording}
        isSpeaking={isSpeaking}
        isLoading={isLoading}
        isDisabled={isDisabled}
        disabledMessage={disabledMessage}
        onStartRecording={startRecording}
        onStopSpeaking={() => setIsSpeaking(false)}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
