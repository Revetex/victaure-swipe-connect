
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Info, RefreshCw } from "lucide-react";
import React from "react";

export function AuthVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [loadError, setLoadError] = useState(false);
  
  // Référence à la vidéo pour pouvoir la contrôler
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Liste de vidéos de secours au cas où l'une ne fonctionne pas
  const videoUrls = [
    "https://assets.mixkit.co/videos/preview/mixkit-business-team-working-in-a-modern-office-21806-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-young-woman-working-on-laptop-in-the-office-43923-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-office-setup-at-a-startup-company-4719-large.mp4"
  ];
  
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  // Gestion de la lecture/pause et du son
  const handleVideoControls = {
    togglePlay: () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play().catch(err => {
            console.error("Erreur lors de la lecture:", err);
            setIsPlaying(false);
          });
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
      setLoadError(false);
      console.log("Vidéo chargée avec succès");
    },
    
    handleVideoError: () => {
      console.error("Erreur lors du chargement de la vidéo");
      setLoadError(true);
      setVideoLoaded(false);
      
      // Essayer la vidéo suivante après une erreur
      if (currentVideoIndex < videoUrls.length - 1) {
        setCurrentVideoIndex(prevIndex => prevIndex + 1);
      }
    },
    
    retryLoading: () => {
      if (videoRef.current) {
        videoRef.current.load();
      }
    }
  };
  
  // Démarrer automatiquement la vidéo (muette) lorsqu'elle est chargée
  useEffect(() => {
    if (videoRef.current && videoLoaded) {
      videoRef.current.play().catch(err => {
        console.error("Erreur lors de la lecture automatique:", err);
        setIsPlaying(false);
      });
    }
  }, [videoLoaded]);

  // Réinitialiser l'état de chargement quand l'URL de la vidéo change
  useEffect(() => {
    setVideoLoaded(false);
    setLoadError(false);
    setIsPlaying(false);
  }, [currentVideoIndex]);

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-t-xl">
      <VideoLoader isLoaded={videoLoaded} loadError={loadError} onRetry={handleVideoControls.retryLoading} />
      <VideoElement 
        videoRef={videoRef} 
        videoUrl={videoUrls[currentVideoIndex]}
        onLoadedData={handleVideoControls.handleVideoLoaded} 
        onError={handleVideoControls.handleVideoError}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <VideoOverlay />
      <VideoBadge />
      
      {/* Info en surimpression */}
      {showInfo && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute inset-0 bg-black/70 flex items-center justify-center p-8 text-center"
        >
          <div className="max-w-md">
            <h3 className="text-[#64B5D9] text-xl mb-4 font-semibold">Victaure Pro</h3>
            <p className="text-[#F2EBE4] text-sm">
              Cette démonstration montre comment Victaure transforme l'expérience de recrutement avec des 
              outils d'IA avancés et une interface intuitive pour les candidats et les recruteurs.
            </p>
            <button 
              onClick={() => setShowInfo(false)}
              className="mt-6 px-4 py-2 bg-[#64B5D9]/20 hover:bg-[#64B5D9]/30 text-[#F2EBE4] rounded-full border border-[#64B5D9]/30 transition-colors"
            >
              Fermer
            </button>
          </div>
        </motion.div>
      )}
      
      <VideoControls 
        isPlaying={isPlaying} 
        isMuted={isMuted} 
        onTogglePlay={handleVideoControls.togglePlay}
        onToggleMute={handleVideoControls.toggleMute}
        onInfoClick={() => setShowInfo(!showInfo)}
        showInfo={showInfo}
      />
    </div>
  );
}

// Composants extraits
function VideoLoader({ isLoaded, loadError, onRetry }: { isLoaded: boolean, loadError: boolean, onRetry: () => void }) {
  if (isLoaded) return null;
  
  return (
    <div className="absolute inset-0 bg-[#1A1F2C] flex items-center justify-center">
      {loadError ? (
        <div className="flex flex-col items-center">
          <p className="text-[#F2EBE4]/80 mb-4">Erreur de chargement de la vidéo</p>
          <button 
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-[#64B5D9]/20 hover:bg-[#64B5D9]/30 text-[#F2EBE4] rounded-full border border-[#64B5D9]/30 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </button>
        </div>
      ) : (
        <div className="w-12 h-12 border-4 border-[#64B5D9]/20 border-t-[#64B5D9] rounded-full animate-spin"></div>
      )}
    </div>
  );
}

function VideoElement({ 
  videoRef, 
  videoUrl,
  onLoadedData, 
  onError,
  onPlay, 
  onPause 
}: { 
  videoRef: React.RefObject<HTMLVideoElement>,
  videoUrl: string,
  onLoadedData: () => void,
  onError: () => void,
  onPlay: () => void,
  onPause: () => void
}) {
  return (
    <video
      ref={videoRef}
      className="w-full h-full object-cover"
      src={videoUrl}
      loop
      muted
      playsInline
      preload="auto"
      onLoadedData={onLoadedData}
      onError={onError}
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
      <span className="ml-1 text-xs text-[#64B5D9] font-semibold">Pro</span>
    </motion.div>
  );
}

function VideoControls({ 
  isPlaying, 
  isMuted, 
  showInfo,
  onTogglePlay,
  onToggleMute,
  onInfoClick
}: { 
  isPlaying: boolean, 
  isMuted: boolean,
  showInfo: boolean,
  onTogglePlay: () => void,
  onToggleMute: () => void,
  onInfoClick: () => void
}) {
  return (
    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <PlayButton isPlaying={isPlaying} onClick={onTogglePlay} />
        <MuteButton isMuted={isMuted} onClick={onToggleMute} />
      </div>
      
      <ControlsGroup onInfoClick={onInfoClick} showInfo={showInfo} />
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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isPlaying ? (
        <Pause className="w-5 h-5 text-[#F2EBE4]" />
      ) : (
        <Play className="w-5 h-5 text-[#F2EBE4]" />
      )}
    </motion.button>
  );
}

function MuteButton({ isMuted, onClick }: { isMuted: boolean, onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.4 }}
      onClick={onClick}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-[#64B5D9]/20 backdrop-blur-md border border-[#64B5D9]/30 hover:bg-[#64B5D9]/30 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-[#F2EBE4]" />
      ) : (
        <Volume2 className="w-5 h-5 text-[#F2EBE4]" />
      )}
    </motion.button>
  );
}

function ControlsGroup({ showInfo, onInfoClick }: { showInfo: boolean, onInfoClick: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        onClick={onInfoClick}
        className={`flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md border transition-colors ${showInfo ? 'bg-[#64B5D9]/30 border-[#64B5D9]/50' : 'bg-[#64B5D9]/20 border-[#64B5D9]/30 hover:bg-[#64B5D9]/30'}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Info className="w-5 h-5 text-[#F2EBE4]" />
      </motion.button>
      
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 0.4 }}
        className="text-xs text-[#F2EBE4]/80 bg-[#1A1F2C]/70 backdrop-blur-md px-4 py-2 rounded-full shadow-md"
      >
        Découvrez Victaure en action
      </motion.div>
    </div>
  );
}
