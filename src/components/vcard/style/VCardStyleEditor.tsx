import { UserProfile } from "@/types/profile";
import { Label } from "@/components/ui/label";
import { VCardButton } from "@/components/vcard/VCardButton";
import { Paintbrush, Type, Palette, TextCursor } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ColorPicker } from "../ColorPicker";
import { useVCardStyle } from "../VCardStyleContext";
import { debounce } from "lodash";
import { useCallback } from "react";

interface VCardStyleEditorProps {
  profile: UserProfile;
  onStyleChange: (updates: Partial<UserProfile>) => void;
}

const fontOptions = [
  { value: "'Poppins', sans-serif", label: "Poppins" },
  { value: "'Montserrat', sans-serif", label: "Montserrat" },
  { value: "'Playfair Display', serif", label: "Playfair Display" },
  { value: "'Roboto', sans-serif", label: "Roboto" },
  { value: "'Open Sans', sans-serif", label: "Open Sans" },
];

export function VCardStyleEditor({ profile, onStyleChange }: VCardStyleEditorProps) {
  const { selectedStyle } = useVCardStyle();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedStyleChange = useCallback(
    debounce((updates: Partial<UserProfile>) => {
      onStyleChange(updates);
      toast.success("Style mis à jour");
    }, 1000),
    []
  );

  const handleStyleChange = useCallback((updates: Partial<UserProfile>) => {
    debouncedStyleChange(updates);
  }, [debouncedStyleChange]);

  const getCurrentBackground = () => {
    if (profile.custom_background) return profile.custom_background;
    return typeof selectedStyle.colors.background === 'string' 
      ? selectedStyle.colors.background 
      : selectedStyle.colors.background.card;
  };

  return (
    <div className="space-y-6 p-6 rounded-xl shadow-lg border bg-card">
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
            <SelectTrigger className="h-12 bg-background border-2">
              <SelectValue placeholder="Choisir une police" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] bg-background border-2">
              {fontOptions.map((font) => (
                <SelectItem 
                  key={font.value} 
                  value={font.value}
                  className="h-12 hover:bg-muted flex items-center px-4"
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
          <div className="flex items-center gap-4">
            <ColorPicker
              color={getCurrentBackground()}
              onChange={(color) => handleStyleChange({ custom_background: color })}
              className="w-full"
            />
            <div 
              className="w-12 h-12 rounded-lg border-2"
              style={{ backgroundColor: getCurrentBackground() }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-foreground">
            <TextCursor className="h-4 w-4" />
            Couleur du texte
          </Label>
          <div className="flex items-center gap-4">
            <ColorPicker
              color={profile.custom_text_color || selectedStyle.colors.text.primary}
              onChange={(color) => handleStyleChange({ custom_text_color: color })}
              className="w-full"
            />
            <div 
              className="w-12 h-12 rounded-lg border-2"
              style={{ backgroundColor: profile.custom_text_color || selectedStyle.colors.text.primary }}
            />
          </div>
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