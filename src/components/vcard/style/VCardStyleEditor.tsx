import { UserProfile } from "@/types/profile";
import { Label } from "@/components/ui/label";
import { VCardButton } from "@/components/vcard/VCardButton";
import { Paintbrush, Type, Palette, TextCursor } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ColorPicker } from "../ColorPicker";
import { useVCardStyle } from "../VCardStyleContext";

interface VCardStyleEditorProps {
  profile: UserProfile;
  onStyleChange: (updates: Partial<UserProfile>) => void;
}

const fontOptions = [
  { value: "'Poppins', sans-serif", label: "Poppins" },
  { value: "'Montserrat', sans-serif", label: "Montserrat" },
  { value: "'Playfair Display', serif", label: "Playfair Display" },
  { value: "'DM Sans', sans-serif", label: "DM Sans" },
  { value: "'Inter', sans-serif", label: "Inter" },
  { value: "'Roboto', sans-serif", label: "Roboto" },
  { value: "'Open Sans', sans-serif", label: "Open Sans" },
  { value: "'Lora', serif", label: "Lora" },
  { value: "'Source Sans Pro', sans-serif", label: "Source Sans Pro" },
  { value: "'Work Sans', sans-serif", label: "Work Sans" },
];

export function VCardStyleEditor({ profile, onStyleChange }: VCardStyleEditorProps) {
  const { selectedStyle } = useVCardStyle();

  const handleStyleChange = (updates: Partial<UserProfile>) => {
    onStyleChange(updates);
    toast.success("Style mis à jour");
  };

  const getCurrentBackground = () => {
    if (profile.custom_background) return profile.custom_background;
    return typeof selectedStyle.colors.background === 'string' 
      ? selectedStyle.colors.background 
      : selectedStyle.colors.background.card;
  };

  return (
    <div className="space-y-6 p-6 rounded-xl shadow-lg border bg-background/95 backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b pb-4">
        <Paintbrush className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium text-foreground">
          Personnalisation du style
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-foreground">
            <Type className="h-4 w-4" />
            Police de caractères
          </Label>
          <Select
            value={profile.custom_font || selectedStyle.font}
            onValueChange={(value) => handleStyleChange({ custom_font: value })}
          >
            <SelectTrigger className="h-12 bg-background/80 backdrop-blur-sm border-2">
              <SelectValue placeholder="Choisir une police" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {fontOptions.map((font) => (
                <SelectItem 
                  key={font.value} 
                  value={font.value}
                  className="h-12 hover:bg-muted"
                >
                  <span style={{ fontFamily: font.value }}>{font.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-foreground">
            <Palette className="h-4 w-4" />
            Couleur de fond
          </Label>
          <ColorPicker
            color={getCurrentBackground()}
            onChange={(color) => handleStyleChange({ custom_background: color })}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-foreground">
            <TextCursor className="h-4 w-4" />
            Couleur du texte
          </Label>
          <ColorPicker
            color={profile.custom_text_color || selectedStyle.colors.text.primary}
            onChange={(color) => handleStyleChange({ custom_text_color: color })}
            className="w-full"
          />
        </div>

        <VCardButton
          variant="outline"
          onClick={() => handleStyleChange({
            custom_font: undefined,
            custom_background: undefined,
            custom_text_color: undefined
          })}
          className="w-full mt-4"
        >
          Réinitialiser le style
        </VCardButton>
      </div>
    </div>
  );
}