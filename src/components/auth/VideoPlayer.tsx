import { useState } from "react";
import { Play } from "lucide-react";
import { Logo } from "@/components/Logo";

interface VideoPlayerProps {
  onError: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  onLoad: () => void;
}

export function VideoPlayer({ onError, onLoad }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const handlePlayClick = () => {
    const video = document.querySelector('video');
    if (video) {
      video.play();
      setIsPlaying(true);
    }
  };

  const handleVideoSeeking = () => {
    const video = document.querySelector('video');
    if (video && isPlaying) {
      video.play();
    }
  };

  const handleVideoPause = () => {
    const video = document.querySelector('video');
    if (video && !video.seeking) {
      setIsPlaying(false);
    }
  };

  return (
    <div className="mt-8 w-full rounded-xl overflow-hidden shadow-lg relative">
      {isVideoLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      <div className="relative">
        <video
          className="w-full aspect-video object-cover"
          loop
          muted
          playsInline
          preload="auto"
          controls={isPlaying}
          onError={onError}
          onLoadedData={() => {
            setIsVideoLoading(false);
            onLoad();
          }}
          onPause={handleVideoPause}
          onSeeking={handleVideoSeeking}
          onSeeked={handleVideoSeeking}
        >
          <source src="/lovable-uploads/victaurepub.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
        {!isPlaying && (
          <div 
            className="absolute inset-0 bg-[#0F1319]/90 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer group transition-all duration-300"
            onClick={handlePlayClick}
          >
            <Logo size="lg" className="mb-4 opacity-90" />
            <div className="bg-[#1A1F2C] rounded-full p-4 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-[#232936]">
              <Play className="w-8 h-8 text-white" />
            </div>
            <p className="mt-4 text-white/90 font-medium">Découvrez Victaure en vidéo</p>
          </div>
        )}
      </div>
    </div>
  );
}