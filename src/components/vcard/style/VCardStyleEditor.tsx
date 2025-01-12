import { useVCardStyle } from "../VCardStyleContext";
import { UserProfile } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Paintbrush, Type, Palette } from "lucide-react";
import { styleOptions } from "../styles";
import { toast } from "sonner";

const fontOptions = [
  { value: "'Poppins', sans-serif", label: "Poppins" },
  { value: "'Montserrat', sans-serif", label: "Montserrat" },
  { value: "'Playfair Display', serif", label: "Playfair Display" },
  { value: "'DM Sans', sans-serif", label: "DM Sans" },
  { value: "'Inter', sans-serif", label: "Inter" },
  { value: "'Roboto', sans-serif", label: "Roboto" },
  { value: "'Lora', serif", label: "Lora" },
  { value: "'Open Sans', sans-serif", label: "Open Sans" },
  { value: "'Source Sans Pro', sans-serif", label: "Source Sans Pro" },
  { value: "'Work Sans', sans-serif", label: "Work Sans" },
  { value: "'Raleway', sans-serif", label: "Raleway" },
  { value: "'Merriweather', serif", label: "Merriweather" },
  { value: "'Nunito', sans-serif", label: "Nunito" },
  { value: "'Ubuntu', sans-serif", label: "Ubuntu" },
  { value: "'Quicksand', sans-serif", label: "Quicksand" }
];

interface VCardStyleEditorProps {
  profile: UserProfile;
  onStyleChange: (updates: Partial<UserProfile>) => void;
}

export function VCardStyleEditor({ profile, onStyleChange }: VCardStyleEditorProps) {
  const { selectedStyle, setSelectedStyle } = useVCardStyle();

  const handleStyleChange = (styleId: string) => {
    const newStyle = styleOptions.find(style => style.id === styleId);
    if (newStyle) {
      setSelectedStyle(newStyle);
      onStyleChange({
        style_id: styleId,
        custom_font: newStyle.font,
        custom_background: newStyle.colors.background.card,
        custom_text_color: newStyle.colors.text.primary
      });
      toast.success("Style appliqué avec succès");
    }
  };

  return (
    <div className="space-y-6 p-6 bg-card rounded-xl shadow-lg backdrop-blur-sm border">
      <div className="flex items-center gap-2 border-b pb-4">
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
            value={profile.custom_font || selectedStyle.font}
            onValueChange={(value) => onStyleChange({ custom_font: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir une police" />
            </SelectTrigger>
            <SelectContent>
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
            Couleur du texte
          </Label>
          <Input
            type="color"
            value={profile.custom_text_color || selectedStyle.colors.text.primary}
            onChange={(e) => onStyleChange({ custom_text_color: e.target.value })}
            className="h-10 px-2"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Arrière-plan
          </Label>
          <Input
            type="color"
            value={profile.custom_background || selectedStyle.colors.background.card}
            onChange={(e) => onStyleChange({ custom_background: e.target.value })}
            className="h-10 px-2"
          />
        </div>
      </div>

      <div className="mt-6">
        <Label className="mb-4 block">Styles prédéfinis</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {styleOptions.map((style) => (
            <button
              key={style.id}
              onClick={() => handleStyleChange(style.id)}
              className={`relative h-20 w-full rounded-lg transition-all ${
                profile.style_id === style.id
                  ? "ring-2 ring-primary"
                  : "hover:ring-2 hover:ring-primary/50"
              }`}
              style={{
                background: style.bgGradient,
                fontFamily: style.font
              }}
            >
              <span className="font-medium text-sm">{style.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}