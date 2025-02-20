import { Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
interface AvatarControlsProps {
  hasAvatar: boolean;
  isLoading: boolean;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
}
export function AvatarControls({
  hasAvatar,
  isLoading,
  onUpload,
  onDelete
}: AvatarControlsProps) {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérification du format uniquement
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      // Si c'est un HEIC, suggérer la conversion
      if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
        toast.error("Le format HEIC n'est pas supporté. Veuillez convertir l'image en JPG");
      } else {
        toast.error("Format non supporté. Utilisez JPG, PNG ou WebP");
      }
      event.target.value = '';
      return;
    }
    onUpload(event);
  };
  return;
}