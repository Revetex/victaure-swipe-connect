import { UserProfile } from "@/types/profile";
import { ColorPicker } from "../ColorPicker";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Paintbrush } from "lucide-react";

interface VCardStyleEditorProps {
  profile: UserProfile;
  onStyleChange: (updates: Partial<UserProfile>) => void;
}

export function VCardStyleEditor({ profile, onStyleChange }: VCardStyleEditorProps) {
  const fonts = [
    { value: "'Inter', sans-serif", label: "Inter" },
    { value: "'Playfair Display', serif", label: "Playfair Display" },
    { value: "'Montserrat', sans-serif", label: "Montserrat" },
    { value: "'Poppins', sans-serif", label: "Poppins" },
    { value: "'DM Sans', sans-serif", label: "DM Sans" },
  ];

  return (
    <div className="space-y-6 p-6 bg-card rounded-xl shadow-lg backdrop-blur-sm border border-border">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <Paintbrush className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium text-foreground">Personnalisation</h3>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <Label className="text-foreground">Police</Label>
          <Select
            value={profile.custom_font || ""}
            onValueChange={(value) => onStyleChange({ custom_font: value })}
          >
            <SelectTrigger className="w-full bg-background border-border">
              <SelectValue placeholder="Choisir une police" />
            </SelectTrigger>
            <SelectContent>
              {fonts.map((font) => (
                <SelectItem
                  key={font.value}
                  value={font.value}
                  style={{ fontFamily: font.value }}
                >
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Couleur d'arrière-plan</Label>
          <ColorPicker
            color={profile.custom_background || "#ffffff"}
            onChange={(color) => onStyleChange({ custom_background: color })}
            className="bg-background border-border"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Couleur du texte</Label>
          <ColorPicker
            color={profile.custom_text_color || "#000000"}
            onChange={(color) => onStyleChange({ custom_text_color: color })}
            className="bg-background border-border"
          />
        </div>
      </div>
    </div>
  );
}