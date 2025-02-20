
import { Maximize2 } from "lucide-react";

interface AvatarOverlayProps {
  showOverlay: boolean;
}

export function AvatarOverlay({ showOverlay }: AvatarOverlayProps) {
  if (!showOverlay) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-full cursor-pointer">
      <Maximize2 className="h-6 w-6 text-white" />
    </div>
  );
}
