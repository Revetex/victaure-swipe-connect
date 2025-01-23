import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { Logo } from "@/components/Logo";

export const AuthVideo = () => {
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoError = () => {
    console.error("Erreur de chargement vidéo");
    setVideoError(true);
    setIsVideoLoading(false);
  };

  const handleVideoLoad = () => {
    setIsVideoLoading(false);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setIsVideoLoading(false);
          })
          .catch(error => {
            console.error("Error playing video:", error);
            setIsVideoLoading(false);
            setVideoError(true);
          });
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-lg bg-muted">
      {isVideoLoading && !videoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/80 backdrop-blur-sm z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      
      {videoError ? (
        <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground">
          <p>La vidéo n'a pas pu être chargée</p>
        </div>
      ) : (
        <div className="relative group">
          <video
            ref={videoRef}
            className="w-full aspect-video object-cover"
            loop
            muted
            playsInline
            preload="metadata"
            onError={handleVideoError}
            onLoadedData={handleVideoLoad}
            poster="/lovable-uploads/poster.jpg"
          >
            <source src="/lovable-uploads/victaurepub.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
          
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
              <Logo size="lg" className="mb-4" />
              <button
                className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                onClick={togglePlay}
              >
                <Play className="w-8 h-8 text-white" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};