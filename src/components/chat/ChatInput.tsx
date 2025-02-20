
import React, { KeyboardEvent, useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, Send, Paperclip, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { speechService } from "@/services/speechRecognitionService";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isThinking?: boolean;
  isListening?: boolean;
  onVoiceInput?: () => void;
  onFileAttach?: (file: File) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  isThinking,
  isListening,
  onVoiceInput,
  onFileAttach,
  placeholder = "Écrivez votre message...",
  disabled = false
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localIsListening, setLocalIsListening] = useState(false);
  const [isVoiceSupported] = useState(() => speechService.isSupported());
  const [audioLevel, setAudioLevel] = useState(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleVoiceInput = () => {
    if (!isVoiceSupported) {
      toast.error("La reconnaissance vocale n'est pas supportée par votre navigateur");
      return;
    }

    if (localIsListening) {
      speechService.stop();
      setLocalIsListening(false);
      setAudioLevel(0);
    } else {
      try {
        speechService.start(
          (text) => {
            onChange(value + ' ' + text);
          },
          () => {
            setLocalIsListening(false);
            setAudioLevel(0);
          }
        );
        setLocalIsListening(true);
        startAudioLevelDetection();
      } catch (error) {
        toast.error("Erreur lors de l'activation de la reconnaissance vocale");
      }
    }
    
    if (onVoiceInput) {
      onVoiceInput();
    }
  };

  const startAudioLevelDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const updateAudioLevel = () => {
        if (!localIsListening) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average / 128); // Normalize to 0-1

        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };

      updateAudioLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) onSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Le fichier est trop volumineux (max 10MB)");
        return;
      }
      
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error("Type de fichier non supporté");
        return;
      }

      onFileAttach?.(file);
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    onChange(textarea.value);
  };

  return (
    <div className="flex items-end gap-2 bg-background rounded-lg p-2">
      <input 
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
      />

      <Button
        size="icon"
        variant="ghost"
        onClick={() => fileInputRef.current?.click()}
        className="rounded-full h-10 w-10"
        disabled={isThinking || disabled}
        title="Joindre un fichier"
      >
        <Paperclip className="h-5 w-5" />
      </Button>

      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={handleTextareaInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || localIsListening}
          className={cn(
            "w-full resize-none bg-muted rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
            "min-h-[44px] max-h-[200px]",
            (disabled || localIsListening) && "opacity-50 cursor-not-allowed",
            localIsListening && "bg-primary/10"
          )}
          style={{
            height: 'auto',
            minHeight: '44px',
            maxHeight: '200px'
          }}
        />
        {localIsListening && (
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `radial-gradient(circle, rgba(var(--primary-rgb), ${audioLevel * 0.2}) 0%, transparent 70%)`
            }}
          >
            <span className="text-primary animate-pulse">Écoute en cours...</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isVoiceSupported && (
          <Button
            size="icon"
            variant={localIsListening ? "default" : "ghost"}
            onClick={handleVoiceInput}
            className={cn(
              "rounded-full h-10 w-10",
              localIsListening && "animate-pulse bg-primary"
            )}
            disabled={isThinking || disabled}
            title={localIsListening ? "Arrêter l'écoute" : "Commencer l'écoute"}
          >
            {localIsListening ? (
              <MicOff className="h-5 w-5 text-white" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
        )}

        <Button
          size="icon"
          onClick={onSend}
          disabled={!value.trim() || isThinking || disabled}
          className="rounded-full h-10 w-10"
          title="Envoyer"
        >
          {isThinking ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
