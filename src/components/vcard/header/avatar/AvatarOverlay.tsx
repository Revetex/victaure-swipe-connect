
import { Maximize2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AvatarOverlayProps {
  showOverlay: boolean;
}

export function AvatarOverlay({ showOverlay }: AvatarOverlayProps) {
  const isMobile = useIsMobile();
  
  if (!showOverlay) return null;
  
  return (
    <div 
      className={`
        absolute inset-0 flex items-center justify-center 
        ${isMobile 
          ? 'bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-sm' 
          : 'bg-gradient-to-br from-black/50 to-black/30 opacity-0 hover:opacity-100'
        }
        transition-all duration-300 ease-in-out rounded-full cursor-pointer
        ring-2 ring-white/20 hover:ring-white/40
      `}
    >
      <Maximize2 
        className={`
          ${isMobile ? 'h-8 w-8' : 'h-6 w-6'}
          text-white/90 drop-shadow-lg
          transform transition-transform duration-300
          ${isMobile ? 'animate-pulse' : 'group-hover:scale-110'}
        `} 
      />
      {isMobile && (
        <span className="sr-only">
          Appuyez pour agrandir
        </span>
      )}
    </div>
  );
}
