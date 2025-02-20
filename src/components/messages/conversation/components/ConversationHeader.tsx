
import { MoreVertical, PhoneCall, PhoneOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Receiver } from "@/types/messages";
import { useState, useEffect, useRef } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ConversationHeaderProps {
  receiver: Receiver;
  onBack: () => void;
  onDelete: () => Promise<void>;
  className?: string;
}

export function ConversationHeader({ receiver, onBack, onDelete, className }: ConversationHeaderProps) {
  const [isInCall, setIsInCall] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const localAudioRef = useRef<HTMLAudioElement | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Cleanup function
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  const initializeCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false 
      });
      
      localStreamRef.current = stream;
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
      }

      // Configuration WebRTC
      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      });

      // Ajout des pistes audio locales
      stream.getTracks().forEach(track => {
        if (peerConnectionRef.current) {
          peerConnectionRef.current.addTrack(track, stream);
        }
      });

      // Gestion des pistes distantes
      peerConnectionRef.current.ontrack = (event) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
        }
      };

      return true;
    } catch (error) {
      console.error("Erreur d'initialisation de l'appel:", error);
      toast.error("Impossible d'accéder au microphone. Vérifiez vos permissions.");
      return false;
    }
  };

  const handleCallClick = async () => {
    if (isInCall) {
      handleEndCall();
      return;
    }

    setIsConnecting(true);
    const initialized = await initializeCall();
    
    if (!initialized) {
      setIsConnecting(false);
      return;
    }

    if (receiver.id === 'victaure') {
      // Appel instantané avec Mr Victaure
      try {
        setIsInCall(true);
        toast.success("Chat vocal avec Mr Victaure activé");
        
        // Simulation de la connexion instantanée avec Mr Victaure
        setTimeout(() => {
          // Ici, on pourrait ajouter une voix TTS pour Mr Victaure
          toast.success("Mr Victaure vous écoute");
        }, 500);

      } catch (error) {
        console.error("Erreur lors de l'appel avec Mr Victaure:", error);
        toast.error("Impossible de démarrer le chat vocal");
        handleEndCall();
      }
    } else {
      // Appel normal avec d'autres utilisateurs
      try {
        setIsInCall(true);
        toast.success("Appel en cours avec " + receiver.full_name);
        
        // Ici, on implémenterait la signalisation WebRTC pour les vrais appels
        
      } catch (error) {
        console.error("Erreur lors de l'appel:", error);
        toast.error("Impossible de démarrer l'appel");
        handleEndCall();
      }
    }
    
    setIsConnecting(false);
  };

  const handleEndCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localAudioRef.current) {
      localAudioRef.current.srcObject = null;
    }
    
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }

    setIsInCall(false);
    toast.info("Appel terminé");
  };

  return (
    <div className={cn("flex items-center justify-between p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <motion.div 
        className="flex items-center gap-2"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mr-2 hover:bg-primary/10 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <Avatar className="h-8 w-8 ring-2 ring-primary/10 transition-all duration-300 hover:ring-primary/20">
          {receiver.avatar_url ? (
            <AvatarImage src={receiver.avatar_url} alt={receiver.full_name} />
          ) : (
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex flex-col">
          <span className="font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {receiver.full_name || "Utilisateur"}
          </span>
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground flex items-center gap-1"
          >
            {isInCall ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                En appel
              </>
            ) : receiver.online_status ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                En ligne
              </>
            ) : null}
          </motion.span>
        </div>
      </motion.div>

      <motion.div 
        className="flex items-center gap-2"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          variant={isInCall ? "destructive" : "ghost"}
          size="icon"
          onClick={handleCallClick}
          disabled={isConnecting}
          className={cn(
            "rounded-full transition-colors duration-300",
            isInCall ? "hover:bg-destructive/90" : "hover:bg-primary/10",
            receiver.id === 'victaure' && "bg-emerald-500 hover:bg-emerald-600 text-white"
          )}
        >
          {isInCall ? (
            <PhoneOff className="h-4 w-4" />
          ) : (
            <PhoneCall className="h-4 w-4" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-colors duration-300">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end"
            className="bg-card/95 backdrop-blur-lg border-primary/10"
          >
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              Supprimer la conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {/* Elements audio cachés pour la gestion des appels */}
      <audio ref={localAudioRef} autoPlay muted className="hidden" />
      <audio ref={remoteAudioRef} autoPlay className="hidden" />
    </div>
  );
}
