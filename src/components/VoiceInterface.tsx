
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { RealtimeChat } from '@/utils/RealtimeAudio';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInterfaceProps {
  onMessageReceived: (message: string) => void;
  onSpeakingChange: (speaking: boolean) => void;
}

export function VoiceInterface({ onMessageReceived, onSpeakingChange }: VoiceInterfaceProps) {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const chatRef = useRef<RealtimeChat | null>(null);

  const handleMessage = (event: any) => {
    console.log('Message reçu:', event);
    
    if (event.type === 'response.audio.delta') {
      onSpeakingChange(true);
    } else if (event.type === 'response.audio.done') {
      onSpeakingChange(false);
    } else if (event.type === 'response.text.delta') {
      onMessageReceived(event.delta);
    }
  };

  const startConversation = async () => {
    try {
      chatRef.current = new RealtimeChat(handleMessage);
      await chatRef.current.init();
      setIsConnected(true);
      
      toast({
        title: "Connecté",
        description: "L'interface vocale est prête",
      });
    } catch (error) {
      console.error('Erreur démarrage conversation:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : 'Impossible de démarrer la conversation',
        variant: "destructive",
      });
    }
  };

  const endConversation = () => {
    chatRef.current?.disconnect();
    setIsConnected(false);
    onSpeakingChange(false);
  };

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="fixed bottom-8 right-8 flex items-center gap-4">
      <Button 
        size="lg"
        variant={isConnected ? "secondary" : "default"}
        onClick={isConnected ? endConversation : startConversation}
        className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all"
      >
        {isConnected ? (
          <MicOff className="h-6 w-6" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
}
