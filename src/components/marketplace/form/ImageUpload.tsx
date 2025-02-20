
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  imageUrls: string[];
  onImageUpload: (files: FileList | null) => void;
  onImageRemove: (index: number) => void;
}

export function ImageUpload({ imageUrls, onImageUpload, onImageRemove }: ImageUploadProps) {
  return (
    <div className="space-y-2">
      <Label>Images</Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {imageUrls.map((url, index) => (
          <div key={url} className="relative aspect-square group">
            <img
              src={url}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onImageRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {imageUrls.length < 8 && (
          <Button
            type="button"
            variant="outline"
            className="aspect-square flex flex-col items-center justify-center gap-2"
            onClick={() => document.getElementById('images')?.click()}
          >
            <Upload className="h-6 w-6" />
            <span className="text-xs">Ajouter</span>
          </Button>
        )}
      </div>
      <input
        id="images"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => onImageUpload(e.target.files)}
      />
      <p className="text-xs text-muted-foreground">
        Ajoutez jusqu'à 8 images. Format: JPG, PNG (max 5MB/image)
      </p>
    </div>
  );
}
