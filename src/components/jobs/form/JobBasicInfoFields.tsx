import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface JobBasicInfoFieldsProps {
  title: string;
  description: string;
  budget: string;
  location: string;
  images: File[];
  onChange: (field: string, value: string | number | File[]) => void;
}

export function JobBasicInfoFields({ 
  title, 
  description, 
  budget, 
  location,
  images,
  onChange 
}: JobBasicInfoFieldsProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file => {
        // Check file type
        if (!file.type.startsWith('image/')) {
          toast.error(`Le fichier ${file.name} n'est pas une image valide`);
          return false;
        }
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`Le fichier ${file.name} est trop volumineux (max 5MB)`);
          return false;
        }
        return true;
      });
      
      // Update parent component with new files
      onChange("images", [...images, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange("images", newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre de la mission</Label>
          <Input
            id="title"
            placeholder="Ex: Développeur React Senior"
            value={title}
            onChange={(e) => onChange("title", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Décrivez la mission en détail"
            value={description}
            onChange={(e) => onChange("description", e.target.value)}
            className="min-h-[150px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Ville</Label>
          <Input
            placeholder="Ex: Montréal"
            value={location}
            onChange={(e) => onChange("location", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Budget (CAD)</Label>
          <Input
            id="budget"
            type="number"
            placeholder="Ex: 5000"
            value={budget}
            onChange={(e) => onChange("budget", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="block mb-2">Images de la mission</Label>
          <div className="flex flex-wrap gap-4">
            {images.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg border border-border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4 text-foreground" />
                </button>
              </div>
            ))}
            <label 
              className={cn(
                "w-24 h-24 flex flex-col items-center justify-center gap-2",
                "border-2 border-dashed border-muted-foreground/25",
                "rounded-lg cursor-pointer hover:border-muted-foreground/50 transition-colors",
                "bg-muted/50"
              )}
            >
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Ajouter</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Formats acceptés: JPG, PNG. Taille max: 5MB
          </p>
        </div>
      </div>
    </div>
  );
}