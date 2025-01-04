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
        setIsMuted(false);
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
    <div className="relative rounded-2xl overflow-hidden group bg-slate-900 shadow-xl">
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
      <div className={`absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/30 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
        <Logo size="md" className="absolute top-6 right-6 w-10 h-10" />
        
        <div className={`flex gap-3 ${isPlaying ? 'absolute bottom-6 left-1/2 -translate-x-1/2' : ''}`}>
          <button
            className={`
              ${isPlaying 
                ? 'p-2.5 bg-purple-500/40 hover:bg-purple-500/60' 
                : 'p-6 bg-purple-500/30 hover:bg-purple-500/50'
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
                ? 'p-2.5 bg-purple-500/40 hover:bg-purple-500/60' 
                : 'p-6 bg-purple-500/30 hover:bg-purple-500/50'
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