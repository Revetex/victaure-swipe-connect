import { useCallback, useRef, useState } from "react";
import { Play } from "lucide-react";
import { Logo } from "../Logo";

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

  return (
    <div className="relative rounded-lg overflow-hidden group">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onEnded={() => setIsPlaying(false)}
        poster="/lovable-uploads/decouvrez-victaure-en-video.png"
      >
        <source src="/lovable-uploads/victaurepub.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>
      
      {/* Video Overlay */}
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <Logo size="md" className="absolute top-4 right-4 w-8 h-8" />
        
        <button
          className="p-4 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          onClick={togglePlay}
        >
          <Play className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  );
}