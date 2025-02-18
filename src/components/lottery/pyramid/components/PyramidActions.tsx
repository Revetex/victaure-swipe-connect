
import { Button } from "@/components/ui/button";

interface PyramidActionsProps {
  onSecureGains: () => void;
  onPlay: () => void;
  isPlayDisabled: boolean;
}

export function PyramidActions({ onSecureGains, onPlay, isPlayDisabled }: PyramidActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button 
        variant="outline" 
        onClick={onSecureGains}
        className="w-full"
      >
        Sécuriser 50% des gains
      </Button>
      <Button 
        onClick={onPlay}
        className="w-full"
        disabled={isPlayDisabled}
      >
        Jouer
      </Button>
    </div>
  );
}
