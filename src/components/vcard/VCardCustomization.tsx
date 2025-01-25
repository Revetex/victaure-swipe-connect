import { UserProfile } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paintbrush, Type, Palette, TextCursor } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const fontOptions = [
  { value: "'Poppins', sans-serif", label: "Poppins" },
  { value: "'Montserrat', sans-serif", label: "Montserrat" },
  { value: "'Playfair Display', serif", label: "Playfair Display" },
  { value: "'Roboto', sans-serif", label: "Roboto" },
  { value: "'Open Sans', sans-serif", label: "Open Sans" },
];

interface VCardCustomizationProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

export function VCardCustomization({ profile, setProfile }: VCardCustomizationProps) {
  return (
    <div className="space-y-6 p-6 bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 border-b pb-4 border-gray-200 dark:border-gray-700">
        <Paintbrush className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Personnalisation</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Police
          </Label>
          <Select
            value={profile.custom_font || "'Poppins', sans-serif"}
            onValueChange={(value) => setProfile({ ...profile, custom_font: value })}
          >
            <SelectTrigger className="w-full bg-white dark:bg-gray-900">
              <SelectValue placeholder="Choisir une police" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900">
              {fontOptions.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  <span style={{ fontFamily: font.value }}>{font.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Arrière-plan
          </Label>
          <Input
            type="color"
            value={profile.custom_background || "#ffffff"}
            onChange={(e) => setProfile({ ...profile, custom_background: e.target.value })}
            className="h-10 px-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <TextCursor className="h-4 w-4" />
            Couleur du texte
          </Label>
          <Input
            type="color"
            value={profile.custom_text_color || "#000000"}
            onChange={(e) => setProfile({ ...profile, custom_text_color: e.target.value })}
            className="h-10 px-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md"
          />
        </div>
      </div>
    </div>
  );
}