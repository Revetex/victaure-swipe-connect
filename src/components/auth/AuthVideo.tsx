import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { Logo } from "@/components/Logo";
import { QRCodeSVG } from "qrcode.react";

export const AuthVideo = () => {
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const apkUrl = "http://localhost:5173/victaure.apk";

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

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error("Error playing video:", error);
        });
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
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
            onPause={handlePause}
            onPlay={handlePlay}
            controls={isPlaying}
          >
            <source src="/lovable-uploads/victaurepub.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
          
          {/* Video Overlay - Now shown when not playing */}
          <div 
            className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <Logo size="lg" className="mb-4" />
            <button
              className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors mb-6"
              onClick={togglePlay}
            >
              <Play className="w-8 h-8 text-white" />
            </button>

            {/* QR Code Section */}
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG 
                value={apkUrl}
                size={150}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-white text-sm mt-2">
              Scannez pour télécharger l'application
            </p>
          </div>
        </div>
      )}
    </div>
  );
};