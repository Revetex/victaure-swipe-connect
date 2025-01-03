import { useCallback, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

export function AuthVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      videoRef.current.currentTime = percentage * videoRef.current.duration;
    }
  }, []);

  return (
    <div className="relative group">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onEnded={() => setIsPlaying(false)}
      >
        <source src="/lovable-uploads/victaurepub.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>
      
      {/* Video Controls */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          className="p-4 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white" />
          )}
        </button>
      </div>

      {/* Video Progress Bar */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-2 bg-black/20 cursor-pointer"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-primary transition-all"
          style={{
            width: `${videoRef.current ? (videoRef.current.currentTime / videoRef.current.duration) * 100 : 0}%`
          }}
        />
      </div>
    </div>
  );
}