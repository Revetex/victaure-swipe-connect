
import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { speechService } from '@/services/speechRecognitionService';
import { cn } from '@/lib/utils';

interface VoiceInterfaceProps {
  onMessageReceived: (message: string) => void;
  onSpeakingChange: (speaking: boolean) => void;
  className?: string;
}

export function VoiceInterface({ 
  onMessageReceived, 
  onSpeakingChange,
  className 
}: VoiceInterfaceProps) {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const handleSpeechResult = useCallback((text: string) => {
    console.log('Texte reconnu:', text);
    onMessageReceived(text);
  }, [onMessageReceived]);

  const toggleListening = useCallback(async () => {
    try {
      if (isListening) {
        speechService.stop();
        setIsListening(false);
        onSpeakingChange(false);
      } else {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        speechService.start(handleSpeechResult);
        setIsListening(true);
        toast({
          title: "Mode vocal activé",
          description: "Je vous écoute...",
        });
      }
    } catch (error) {
      console.error('Erreur accès micro:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au microphone",
        variant: "destructive",
      });
    }
  }, [isListening, handleSpeechResult, onSpeakingChange, toast]);

  const toggleAudio = useCallback(() => {
    setAudioEnabled(!audioEnabled);
    toast({
      title: audioEnabled ? "Audio désactivé" : "Audio activé",
      description: audioEnabled ? "Les réponses seront textuelles" : "Les réponses seront vocales",
    });
  }, [audioEnabled, toast]);

  // Nettoyage à la fermeture
  useEffect(() => {
    return () => {
      if (isListening) {
        speechService.stop();
      }
    };
  }, [isListening]);

  return (
    <div className={cn("fixed z-50 flex items-center gap-2", className)}>
      <Button
        size="lg"
        variant="outline"
        onClick={toggleAudio}
        className={cn(
          "rounded-full w-12 h-12",
          "transition-colors duration-200",
          audioEnabled ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </Button>

      <Button
        size="lg"
        variant={isListening ? "destructive" : "default"}
        onClick={toggleListening}
        className={cn(
          "rounded-full w-12 h-12",
          "transition-all duration-200",
          isListening && "animate-pulse"
        )}
      >
        {isListening ? (
          <MicOff className="h-5 w-5" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
