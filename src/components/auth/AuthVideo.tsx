
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import React from "react";

export function AuthVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  // Référence à la vidéo pour pouvoir la contrôler
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Gestion de la lecture/pause et du son
  const handleVideoControls = {
    togglePlay: () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    },
    
    toggleMute: () => {
      if (videoRef.current) {
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    },
    
    handleVideoLoaded: () => {
      setVideoLoaded(true);
    }
  };
  
  // Démarrer automatiquement la vidéo (muette) lorsqu'elle est chargée
  useEffect(() => {
    if (videoRef.current && videoLoaded) {
      videoRef.current.play().catch(() => {
        // La lecture automatique a été bloquée par le navigateur
        setIsPlaying(false);
      });
    }
  }, [videoLoaded]);

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-t-xl">
      <VideoLoader isLoaded={videoLoaded} />
      <VideoElement 
        videoRef={videoRef} 
        onLoadedData={handleVideoControls.handleVideoLoaded} 
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <VideoOverlay />
      <VideoBadge />
      <VideoControls 
        isPlaying={isPlaying} 
        isMuted={isMuted} 
        onTogglePlay={handleVideoControls.togglePlay}
        onToggleMute={handleVideoControls.toggleMute}
      />
    </div>
  );
}

// Composants extraits
function VideoLoader({ isLoaded }: { isLoaded: boolean }) {
  if (isLoaded) return null;
  
  return (
    <div className="absolute inset-0 bg-[#1A1F2C] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#64B5D9]/20 border-t-[#64B5D9] rounded-full animate-spin"></div>
    </div>
  );
}

function VideoElement({ 
  videoRef, 
  onLoadedData, 
  onPlay, 
  onPause 
}: { 
  videoRef: React.RefObject<HTMLVideoElement>,
  onLoadedData: () => void,
  onPlay: () => void,
  onPause: () => void
}) {
  return (
    <video
      ref={videoRef}
      className="w-full h-full object-cover"
      src="https://assets.mixkit.co/videos/preview/mixkit-business-team-working-in-a-modern-office-21806-large.mp4"
      loop
      muted
      playsInline
      onLoadedData={onLoadedData}
      onPlay={onPlay}
      onPause={onPause}
    />
  );
}

function VideoOverlay() {
  return (
    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1F2C] via-transparent to-transparent opacity-70"></div>
  );
}

function VideoBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="absolute top-4 left-4 bg-[#1A1F2C]/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#64B5D9]/30"
    >
      <span className="text-sm font-medium text-[#F2EBE4]">Victaure</span>
      <span className="ml-1 text-xs text-[#64B5D9]">Pro</span>
    </motion.div>
  );
}

function VideoControls({ 
  isPlaying, 
  isMuted, 
  onTogglePlay,
  onToggleMute 
}: { 
  isPlaying: boolean, 
  isMuted: boolean,
  onTogglePlay: () => void,
  onToggleMute: () => void
}) {
  return (
    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
      <PlayButton isPlaying={isPlaying} onClick={onTogglePlay} />
      <ControlsGroup isMuted={isMuted} onToggleMute={onToggleMute} />
    </div>
  );
}

function PlayButton({ isPlaying, onClick }: { isPlaying: boolean, onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      onClick={onClick}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-[#64B5D9]/20 backdrop-blur-md border border-[#64B5D9]/30 hover:bg-[#64B5D9]/30 transition-colors"
    >
      {isPlaying ? (
        <Pause className="w-5 h-5 text-[#F2EBE4]" />
      ) : (
        <Play className="w-5 h-5 text-[#F2EBE4]" />
      )}
    </motion.button>
  );
}

function ControlsGroup({ isMuted, onToggleMute }: { isMuted: boolean, onToggleMute: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.4 }}
      className="flex items-center gap-3"
    >
      <button
        onClick={onToggleMute}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#64B5D9]/20 backdrop-blur-md border border-[#64B5D9]/30 hover:bg-[#64B5D9]/30 transition-colors"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-[#F2EBE4]" />
        ) : (
          <Volume2 className="w-5 h-5 text-[#F2EBE4]" />
        )}
      </button>
      
      <div className="text-xs text-[#F2EBE4]/80 bg-[#1A1F2C]/60 backdrop-blur-md px-3 py-1 rounded-full">
        Découvrez Victaure en action
      </div>
    </motion.div>
  );
}
