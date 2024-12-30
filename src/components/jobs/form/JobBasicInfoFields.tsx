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
import { Image, Upload } from "lucide-react";
import { useState } from "react";

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
      const newImages = Array.from(e.target.files);
      onChange("images", [...images, ...newImages]);
      
      // Create preview URLs
      const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const handleProvinceChange = (value: string) => {
    onChange("province", value);
    onChange("location", ""); // Reset city when province changes
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
              onValueChange={handleProvinceChange}
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
          <Label>Images de la mission</Label>
          <div className="flex flex-wrap gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative w-24 h-24">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-24 h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <Upload className="h-6 w-6" />
              <span className="text-xs">Ajouter</span>
            </Button>
          </div>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      </div>
    </div>
  );
}