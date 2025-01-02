import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { Logo } from "@/components/Logo";

export const AuthVideo = () => {
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);

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

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isScrubbing) {
      setIsPlaying(!videoRef.current.paused);
    }
  };

  const handleScrubStart = () => {
    setIsScrubbing(true);
  };

  const handleScrubEnd = () => {
    setIsScrubbing(false);
  };

  return (
    <div className="mt-8 w-full rounded-xl overflow-hidden shadow-lg relative">
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
          >
            <source src="/lovable-uploads/victaurepub.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
          
          {/* Video Overlay - Now completely hidden when playing */}
          <div 
            className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            onClick={togglePlay}
          >
            <Logo size="lg" className="mb-4" />
            <button
              className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={togglePlay}
            >
              <Play className="w-8 h-8 text-white" />
            </button>
          </div>

          {/* Custom Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <input
              type="range"
              className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
              min="0"
              max={videoRef.current?.duration || 100}
              value={videoRef.current?.currentTime || 0}
              onChange={(e) => {
                if (videoRef.current) {
                  videoRef.current.currentTime = Number(e.target.value);
                }
              }}
              onMouseDown={handleScrubStart}
              onMouseUp={handleScrubEnd}
              onTouchStart={handleScrubStart}
              onTouchEnd={handleScrubEnd}
            />
          </div>
        </div>
      )}
    </div>
  );
};