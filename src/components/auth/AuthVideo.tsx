import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

export const AuthVideo = () => {
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Erreur de chargement vidéo:", e);
    const video = e.target as HTMLVideoElement;
    console.log("Video source:", video.currentSrc);
    console.log("Video ready state:", video.readyState);
    console.log("Video network state:", video.networkState);
    console.log("Video error:", video.error?.message);
    setVideoError(true);
    setIsVideoLoading(false);
  };

  const handleVideoLoad = () => {
    console.log("Vidéo chargée avec succès");
    setIsVideoLoading(false);
  };

  const togglePlay = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!videoRef.current) return;

    try {
      if (videoRef.current.paused) {
        await videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Error playing video:", error);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(progress);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const time = (percentage / 100) * videoRef.current.duration;
    
    videoRef.current.currentTime = time;
    setProgress(percentage);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-lg">
      {isVideoLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
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
            onTimeUpdate={handleTimeUpdate}
            onPause={handlePause}
            onPlay={handlePlay}
          >
            <source src="/lovable-uploads/victaurepub.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
          
          {/* Video Overlay */}
          <div 
            className={cn(
              "absolute inset-0 bg-black/60 flex flex-col items-center justify-center transition-opacity duration-300",
              isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
            )}
            onClick={togglePlay}
          >
            <div className="flex flex-col items-center space-y-4 bg-white/10 p-8 rounded-xl backdrop-blur-sm">
              <Logo size="lg" className="mb-2" />
              <h2 className="text-xl font-semibold text-white">
                Bienvenue sur Victaure
              </h2>
              <p className="text-sm text-white/80">
                Connectez-vous pour accéder à votre espace
              </p>
              <button
                className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Video Progress Bar */}
          <div 
            className={cn(
              "absolute bottom-0 left-0 right-0 h-1 bg-black/30 cursor-pointer transition-opacity duration-300",
              isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
            )}
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-primary transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};