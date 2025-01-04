import { useCallback, useRef, useState } from "react";
import { Play, Pause, RefreshCw } from "lucide-react";
import { Logo } from "../Logo";

export function AuthVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        setIsMuted(false); // Unmute when playing
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleReplay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
      setIsMuted(false);
    }
  }, []);

  return (
    <div className="relative rounded-xl overflow-hidden group bg-gray-900">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onEnded={() => setIsPlaying(false)}
        autoPlay
        muted={isMuted}
        loop={false}
      >
        <source src="/lovable-uploads/victaurepub.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>
      
      {/* Video Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-gray-900/30 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
        <Logo size="md" className="absolute top-4 right-4 w-8 h-8 text-white" />
        
        <div className={`flex gap-2 ${isPlaying ? 'absolute bottom-4 left-1/2 -translate-x-1/2' : ''}`}>
          <button
            className={`
              ${isPlaying 
                ? 'p-2 bg-cyan-500/30 hover:bg-cyan-500/50' 
                : 'p-6 bg-purple-500/20 hover:bg-purple-500/30'
              } 
              rounded-full transition-all duration-300 hover:scale-110 group-hover:scale-110
            `}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className={`${isPlaying ? 'w-6 h-6' : 'w-12 h-12'} text-white`} />
            ) : (
              <Play className={`${isPlaying ? 'w-6 h-6' : 'w-12 h-12'} text-white`} />
            )}
          </button>
          
          <button
            className={`
              ${isPlaying 
                ? 'p-2 bg-cyan-500/30 hover:bg-cyan-500/50' 
                : 'p-6 bg-purple-500/20 hover:bg-purple-500/30'
              } 
              rounded-full transition-all duration-300 hover:scale-110 group-hover:scale-110
            `}
            onClick={handleReplay}
          >
            <RefreshCw className={`${isPlaying ? 'w-6 h-6' : 'w-12 h-12'} text-white`} />
          </button>
        </div>
      </div>
    </div>
  );
}