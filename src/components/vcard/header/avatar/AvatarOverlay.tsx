
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
          ? 'bg-black/60 opacity-100 backdrop-blur-sm' 
          : 'bg-black/40 opacity-0 hover:opacity-100'
        }
        transition-opacity rounded-full cursor-pointer
      `}
    >
      <Maximize2 
        className={`
          ${isMobile ? 'h-8 w-8' : 'h-6 w-6'}
          text-white 
          ${isMobile ? 'animate-pulse' : ''}
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
