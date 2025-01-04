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
    <div className="relative rounded-xl overflow-hidden group bg-gray-900">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onEnded={() => setIsPlaying(false)}
        autoPlay
        muted
        loop
      >
        <source src="/lovable-uploads/victaurepub.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>
      
      {/* Video Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-gray-900/30 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
        <Logo size="md" className="absolute top-4 right-4 w-8 h-8 text-white" />
        
        <button
          className="p-6 rounded-full bg-purple-500/20 hover:bg-purple-500/30 transition-all duration-300 hover:scale-110 group-hover:scale-110"
          onClick={togglePlay}
        >
          <Play className="w-12 h-12 text-white" />
        </button>
      </div>
    </div>
  );
}