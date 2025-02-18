
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { toast } from "sonner";

interface VoiceChatActivatorProps {
  isActive: boolean;
  onActivate: () => void;
}

export function VoiceChatActivator({ isActive, onActivate }: VoiceChatActivatorProps) {
  const handleActivate = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      
      toast.success("Chat vocal activé! Cliquez sur le microphone pour parler.");
      onActivate();
    } catch (error) {
      console.error("Erreur d'accès au microphone:", error);
      toast.error("Impossible d'accéder au microphone. Vérifiez vos permissions.");
    }
  };

  if (isActive) return null;

  return (
    <Button
      onClick={handleActivate}
      className="w-full mb-4 gap-2"
      variant="outline"
    >
      <Mic className="w-4 h-4" />
      Activer le chat vocal
    </Button>
  );
}
