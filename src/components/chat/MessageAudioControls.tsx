
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

interface MessageAudioControlsProps {
  text: string;
}

export function MessageAudioControls({ text }: MessageAudioControlsProps) {
  const { speak, cancel, isSpeaking } = useSpeechSynthesis();

  const handlePlayMessage = () => {
    if (isSpeaking) {
      cancel();
    } else {
      speak(text);
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      className="h-8 w-8"
      onClick={handlePlayMessage}
    >
      {isSpeaking ? (
        <VolumeX className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </Button>
  );
}
