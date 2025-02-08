
import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

export const AuthVideo = () => {
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Erreur de chargement vidéo:", e);
    if (retryCount < 3) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        if (videoRef.current) {
          videoRef.current.load();
        }
      }, 1000 * (retryCount + 1)); // Exponential backoff
    } else {
      setVideoError(true);
    }
    setIsVideoLoading(false);
  };

  const handleVideoLoad = () => {
    setIsVideoLoading(false);
    setVideoError(false);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.muted = false; // Unmute when playing
        videoRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Error playing video:", error);
            setVideoError(true);
          });
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-lg">
      {isVideoLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      {videoError ? (
        <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground rounded-2xl">
          <p>La vidéo n'a pas pu être chargée</p>
        </div>
      ) : (
        <div className="relative group rounded-2xl overflow-hidden">
          <video
            ref={videoRef}
            className={cn(
              "w-full aspect-video object-cover transition-opacity duration-300",
              isVideoLoading && "opacity-0"
            )}
            playsInline
            preload="metadata"
            onError={handleVideoError}
            onLoadedData={handleVideoLoad}
            controls={isPlaying}
            muted
            loop
          >
            <source src="/lovable-uploads/victaurepub.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
          
          <div 
            className={cn(
              "absolute inset-0 bg-black/60 flex flex-col items-center justify-center transition-opacity duration-300",
              isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
            )}
          >
            <Logo size="lg" className="mb-4 animate-fade-in" />
            <button
              className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110"
              onClick={togglePlay}
            >
              <Play className="w-8 h-8 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
