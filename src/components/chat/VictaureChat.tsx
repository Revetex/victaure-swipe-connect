import { useState, useEffect, useRef } from "react";
import { Bot, MessagesSquare, Mic, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { useVictaureChat } from "@/hooks/useVictaureChat";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

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
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const greetUser = async () => {
      try {
        const initialMessage = {
          role: "system",
          content: context
        };
        
        const userGreeting = {
          role: "user",
          content: "Bonjour !"
        };

        const { data, error } = await supabase.functions.invoke("victaure-chat", {
          body: { messages: [initialMessage, userGreeting] }
        });

        if (error) throw error;

        const response = data.choices[0].message.content;
        setMessages([{ content: response, isUser: false }]);
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
    setMessages(prev => [...prev, { 
      content: userMessage, 
      isUser: true,
      username: user?.email || 'Visiteur'
    }]);
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
        })),
        {
          role: "user",
          content: userMessage
        }
      ];

      const { data, error } = await supabase.functions.invoke("victaure-chat", {
        body: { messages: messageHistory }
      });

      if (error) throw error;

      const response = data.choices[0].message.content;
      setMessages(prev => [...prev, { content: response, isUser: false }]);
      speakText(response);
    } catch (error) {
      console.error("Error in chat:", error);
      toast.error("Désolé, je ne peux pas répondre pour le moment");
    }
  };

  return (
    <div className="w-full bg-[#1A1F2C] rounded-xl overflow-hidden border border-[#64B5D9]/20 shadow-lg relative">
      <div className="flex items-center gap-3 p-4 border-b border-[#64B5D9]/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="w-10 h-10 text-[#64B5D9]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1A1F2C]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#F1F0FB]">Mr. Victaure</h3>
            <p className="text-xs text-[#F1F0FB]/60">Assistant IA</p>
          </div>
        </div>
      </div>

      <div 
        ref={chatContainerRef}
        className="h-[400px] overflow-y-auto p-4 scrollbar-none space-y-4"
        style={{
          backgroundImage: "url('/lovable-uploads/60542c40-c17c-42cc-8136-f4780f09946a.png')",
          backgroundSize: "32px",
          backgroundRepeat: "repeat"
        }}
      >
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              message.isUser
                ? 'bg-[#64B5D9] text-white'
                : 'bg-[#2A2D3E] text-[#F1F0FB]'
            }`}>
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-[#1A1F2C]/80 border-t border-[#64B5D9]/10">
        <div className="flex items-center gap-2">
          <button
            onClick={startRecording}
            disabled={isRecording || (userQuestions >= maxQuestions && !user)}
            className="h-10 w-10 flex-shrink-0 rounded-xl bg-[#2A2D3E] text-[#F1F0FB] hover:bg-[#363B4D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            title={isRecording ? "Enregistrement en cours..." : "Enregistrer un message vocal"}
          >
            <Mic className={`w-4 h-4 ${isRecording ? 'text-red-500 animate-pulse' : ''}`} />
          </button>

          <input
            type="text"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            placeholder={
              userQuestions >= maxQuestions && !user
                ? "Connectez-vous pour continuer..."
                : "Envoyez un message à Mr. Victaure..."
            }
            disabled={userQuestions >= maxQuestions && !user}
            className="flex-1 h-10 px-4 rounded-xl bg-[#2A2D3E] text-[#F1F0FB] border border-[#64B5D9]/20 focus:outline-none focus:border-[#64B5D9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed placeholder-[#F1F0FB]/40"
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
          />

          <button
            onClick={handleSendMessage}
            disabled={!userInput.trim() || isLoading || (userQuestions >= maxQuestions && !user)}
            className="h-10 w-10 flex-shrink-0 rounded-xl bg-[#64B5D9] text-white hover:bg-[#64B5D9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <MessagesSquare className="w-4 h-4" />
          </button>

          {isSpeaking && (
            <button
              onClick={() => setIsSpeaking(false)}
              className="h-10 w-10 flex-shrink-0 rounded-xl bg-[#64B5D9] text-white animate-pulse flex items-center justify-center"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
