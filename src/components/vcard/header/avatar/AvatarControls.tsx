
import { Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AvatarControlsProps {
  hasAvatar: boolean;
  isLoading: boolean;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
}

export function AvatarControls({ hasAvatar, isLoading, onUpload, onDelete }: AvatarControlsProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-2">
      <label 
        className="flex items-center justify-center w-10 h-10 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-200"
        htmlFor="avatar-upload"
      >
        <Upload className="h-5 w-5 text-white/90" />
        <input
          id="avatar-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={onUpload}
          disabled={isLoading}
        />
      </label>
      {hasAvatar && (
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/40 transition-all duration-200"
          onClick={onDelete}
          disabled={isLoading}
        >
          <Trash2 className="h-5 w-5 text-white/90" />
        </Button>
      )}
    </div>
  );
}
