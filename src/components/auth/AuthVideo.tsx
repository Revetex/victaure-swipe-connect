
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
  
  // Toggle lecture/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Toggle muet/son
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Vérifier si la vidéo est chargée
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
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
      {/* Overlay de chargement */}
      {!videoLoaded && (
        <div className="absolute inset-0 bg-[#1A1F2C] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#64B5D9]/20 border-t-[#64B5D9] rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Vidéo */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src="https://assets.mixkit.co/videos/preview/mixkit-business-team-working-in-a-modern-office-21806-large.mp4"
        loop
        muted
        playsInline
        onLoadedData={handleVideoLoaded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Overlay avec dégradé pour améliorer la lisibilité du texte et des contrôles */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1F2C] via-transparent to-transparent opacity-70"></div>

      {/* Badge Victaure */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute top-4 left-4 bg-[#1A1F2C]/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#64B5D9]/30"
      >
        <span className="text-sm font-medium text-[#F2EBE4]">Victaure</span>
        <span className="ml-1 text-xs text-[#64B5D9]">Pro</span>
      </motion.div>

      {/* Contrôles vidéo */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          onClick={togglePlay}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#64B5D9]/20 backdrop-blur-md border border-[#64B5D9]/30 hover:bg-[#64B5D9]/30 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-[#F2EBE4]" />
          ) : (
            <Play className="w-5 h-5 text-[#F2EBE4]" />
          )}
        </motion.button>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={toggleMute}
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
      </div>
    </div>
  );
}
