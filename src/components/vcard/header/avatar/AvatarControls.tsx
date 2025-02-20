
import { Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AvatarControlsProps {
  hasAvatar: boolean;
  isLoading: boolean;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
}

export function AvatarControls({ hasAvatar, isLoading, onUpload, onDelete }: AvatarControlsProps) {
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

  return (
    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-full">
      <label 
        className="flex items-center justify-center w-10 h-10 bg-black/40 rounded-full cursor-pointer transition-all duration-200 hover:bg-black/60"
        htmlFor="avatar-upload"
      >
        <Upload className="h-5 w-5 text-white/90" />
        <input
          id="avatar-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileSelect}
          disabled={isLoading}
        />
      </label>
      {hasAvatar && (
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 bg-black/40 rounded-full hover:bg-red-500/40 transition-all duration-200"
          onClick={onDelete}
          disabled={isLoading}
        >
          <Trash2 className="h-5 w-5 text-white/90" />
        </Button>
      )}
    </div>
  );
}
