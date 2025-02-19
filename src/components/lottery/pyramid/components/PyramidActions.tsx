
import { Button } from "@/components/ui/button";

interface PyramidActionsProps {
  onSecureGains: () => void;
  onPlay: () => void;
  isPlayDisabled: boolean;
  isMobile?: boolean;
}

export function PyramidActions({ onSecureGains, onPlay, isPlayDisabled, isMobile }: PyramidActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4">
      <Button 
        variant="outline" 
        onClick={onSecureGains}
        className="w-full"
        size={isMobile ? "sm" : "default"}
      >
        Sécuriser 50% des gains
      </Button>
      <Button 
        onClick={onPlay}
        className="w-full"
        disabled={isPlayDisabled}
        size={isMobile ? "sm" : "default"}
      >
        Jouer
      </Button>
    </div>
  );
}
