import { useState, useEffect, useRef } from "react";
import { Bot, Wand2, MessagesSquare, Search, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { useVictaureChat } from "@/hooks/useVictaureChat";
import { useAuth } from "@/hooks/useAuth";

interface ChatMessage {
  content: string;
  isUser: boolean;
  username?: string;
}

interface VictaureChatProps {
  maxQuestions?: number;
  initialMessage?: string;
  context?: string;
  onMaxQuestionsReached?: () => void;
}

class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  constructor(private onAudioData: (audioData: Float32Array) => void) {}

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      this.audioContext = new AudioContext({ sampleRate: 24000 });
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        this.onAudioData(new Float32Array(inputData));
      };
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  stop() {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

const encodeAudioData = (float32Array: Float32Array): string => {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  const uint8Array = new Uint8Array(int16Array.buffer);
  let binary = '';
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
};

export function VictaureChat({ 
  maxQuestions = 3, 
  initialMessage = "Bonjour ! Je suis Mr. Victaure, votre assistant personnel. Comment puis-je vous aider aujourd'hui ? 🎯",
  context = "Tu es un assistant professionnel qui aide les utilisateurs.",
  onMaxQuestionsReached 
}: VictaureChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showThinking, setShowThinking] = useState(false);
  const [userQuestions, setUserQuestions] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const { user } = useAuth();
  const { sendMessage, isLoading } = useVictaureChat({
    onResponse: async (response) => {
      if (response) {
        setMessages(prev => [...prev, { content: response, isUser: false }]);
        try {
          const { data, error } = await supabase.functions.invoke('text-to-speech', {
            body: { text: response, voice: 'roger' }
          });
          
          if (error) throw error;
          
          if (data?.audioContent) {
            setAudioQueue(prev => [...prev, data.audioContent]);
          }
        } catch (err) {
          console.error('Error converting text to speech:', err);
        }
      }
    }
  });

  useEffect(() => {
    if (audioQueue.length > 0 && !isSpeaking) {
      playNextAudio();
    }
  }, [audioQueue, isSpeaking]);

  const playNextAudio = async () => {
    if (audioQueue.length === 0) return;

    setIsSpeaking(true);
    const audioContent = audioQueue[0];
    const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
    
    audio.onended = () => {
      setIsSpeaking(false);
      setAudioQueue(prev => prev.slice(1));
    };

    try {
      await audio.play();
    } catch (err) {
      console.error('Error playing audio:', err);
      setIsSpeaking(false);
      setAudioQueue(prev => prev.slice(1));
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      setIsSpeaking(false);
      setAudioQueue([]);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      audioRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        audioRecorderRef.current = new AudioRecorder(async (audioData) => {
          try {
            const encodedAudio = encodeAudioData(audioData);
            const { data, error } = await supabase.functions.invoke('voice-to-text', {
              body: { audio: encodedAudio }
            });
            
            if (error) throw error;
            
            if (data?.text) {
              setUserInput(data.text);
            }
          } catch (err) {
            console.error('Error converting speech to text:', err);
          }
        });
        
        await audioRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error starting recording:', err);
        toast.error("Impossible d'accéder au microphone");
      }
    }
  };

  const handleWebSearch = async () => {
    if (!userInput.trim() || isLoading) return;

    setShowThinking(true);
    try {
      const response = await sendMessage(userInput, 
        context + " Utilise tes capacités de recherche sur Internet pour fournir des informations précises et à jour."
      );
      setUserInput("");
    } catch (error) {
      console.error("Error searching:", error);
      toast.error("Désolé, je ne peux pas effectuer la recherche pour le moment");
    } finally {
      setShowThinking(false);
    }
  };

  useEffect(() => {
    const showWelcomeMessage = async () => {
      if (!showWelcome) {
        setShowThinking(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setShowThinking(false);
        setIsTyping(true);
        setMessages([{ content: initialMessage, isUser: false }]);
        setIsTyping(false);
        setShowWelcome(true);
      }
    };

    showWelcomeMessage();
  }, [initialMessage, showWelcome]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (userQuestions >= maxQuestions) {
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
    setShowThinking(true);

    try {
      console.log("Sending message with context:", context);
      const response = await sendMessage(userMessage, context);
      console.log("Received response:", response);
    } catch (error) {
      console.error("Error in chat:", error);
      toast.error("Désolé, je ne peux pas répondre pour le moment");
    } finally {
      setShowThinking(false);
    }
  };

  return (
    <div className="w-full glass-panel rounded-xl overflow-hidden border-2 border-black/10 shadow-lg relative">
      <div className="flex items-center gap-3 bg-[#F1F0FB] dark:bg-zinc-900/80 p-4 border-b border-black/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="w-10 h-10 text-[#1B2A4A]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h3 className="font-semibold text-[#1B2A4A]">Mr. Victaure</h3>
            <p className="text-xs text-[#1B2A4A]/60">Assistant IA</p>
          </div>
        </div>
        {showThinking && (
          <div className="flex items-center gap-1 ml-auto">
            <Wand2 className="w-4 h-4 text-[#64B5D9] animate-pulse" />
            <span className="text-xs text-[#64B5D9]">réfléchit...</span>
          </div>
        )}
      </div>

      <div 
        className="relative bg-white/5 p-4"
        style={{
          backgroundImage: "url('/lovable-uploads/60542c40-c17c-42cc-8136-f4780f09946a.png')",
          backgroundSize: "32px",
          backgroundRepeat: "repeat",
          backgroundColor: "rgba(155, 135, 245, 0.05)"
        }}
      >
        <div 
          ref={chatContainerRef}
          className="flex flex-col justify-end h-[400px] overflow-y-auto mb-4 scrollbar-none"
        >
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className="space-y-1">
                {message.isUser && message.username && (
                  <p className="text-xs text-right text-gray-500 dark:text-gray-400 px-2">
                    {message.username}
                  </p>
                )}
                <div
                  className={`p-3 rounded-lg ${
                    message.isUser
                      ? "ml-auto bg-[#64B5D9] text-white border-transparent max-w-[80%]"
                      : "mr-auto bg-white dark:bg-zinc-800 text-[#1B2A4A] dark:text-white border-[#64B5D9]/10 max-w-[80%]"
                  }`}
                >
                  <p className="text-sm font-medium whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleRecording}
            className="h-10 w-10 flex-shrink-0 rounded-lg bg-[#64B5D9] text-white hover:bg-[#64B5D9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            title={isRecording ? "Arrêter l'enregistrement" : "Démarrer l'enregistrement"}
          >
            {isRecording ? (
              <MicOff className="w-4 h-4 animate-pulse" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>
          <input
            type="text"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            placeholder={
              userQuestions >= maxQuestions
                ? "Connectez-vous pour continuer..."
                : "Posez une question à Mr. Victaure..."
            }
            disabled={userQuestions >= maxQuestions || isLoading}
            className="flex-1 h-10 px-4 rounded-lg bg-white dark:bg-zinc-800 border border-[#64B5D9]/20 focus:outline-none focus:border-[#64B5D9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[#1B2A4A] dark:text-white"
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleWebSearch}
            disabled={userQuestions >= maxQuestions || !userInput.trim() || isLoading}
            className="h-10 w-10 flex-shrink-0 rounded-lg bg-[#64B5D9] text-white hover:bg-[#64B5D9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            title="Rechercher sur le web"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={toggleSpeech}
            className="h-10 w-10 flex-shrink-0 rounded-lg bg-[#64B5D9] text-white hover:bg-[#64B5D9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            title={isSpeaking ? "Arrêter la lecture" : "Écouter les réponses"}
          >
            {isSpeaking ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleSendMessage}
            disabled={userQuestions >= maxQuestions || !userInput.trim() || isLoading}
            className="h-10 w-10 flex-shrink-0 rounded-lg bg-[#64B5D9] text-white hover:bg-[#64B5D9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            title="Envoyer le message"
          >
            <MessagesSquare className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
