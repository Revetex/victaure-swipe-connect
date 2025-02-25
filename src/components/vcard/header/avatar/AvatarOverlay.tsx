import { Maximize2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
interface AvatarOverlayProps {
  showOverlay: boolean;
}
export function AvatarOverlay({
  showOverlay
}: AvatarOverlayProps) {
  const isMobile = useIsMobile();
  if (!showOverlay) return null;
  return;
}