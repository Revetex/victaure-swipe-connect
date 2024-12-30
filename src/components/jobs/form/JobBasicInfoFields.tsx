import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { provinceData } from "@/data/provinces";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Image, Upload, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface JobBasicInfoFieldsProps {
  title: string;
  description: string;
  budget: string;
  location: string;
  province: string;
  images: File[];
  onChange: (field: string, value: string | number | File[]) => void;
}

export function JobBasicInfoFields({ 
  title, 
  description, 
  budget, 
  location,
  province,
  images,
  onChange 
}: JobBasicInfoFieldsProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file => {
        // Check file type
        if (!file.type.startsWith('image/')) {
          console.error('Invalid file type:', file.type);
          return false;
        }
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          console.error('File too large:', file.name);
          return false;
        }
        return true;
      });

      // Create preview URLs for valid files
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
      
      // Update parent component with new files
      onChange("images", [...images, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange("images", newImages);

    const newPreviewUrls = [...previewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]); // Clean up the URL
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Province</Label>
            <Select
              value={province}
              onValueChange={(value) => {
                onChange("province", value);
                onChange("location", "");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une province" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(provinceData).map((prov) => (
                  <SelectItem key={prov} value={prov}>
                    {prov}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Ville</Label>
            <Select
              value={location}
              onValueChange={(value) => onChange("location", value)}
              disabled={!province}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une ville..." />
              </SelectTrigger>
              <SelectContent>
                {province && provinceData[province]?.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
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