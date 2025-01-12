import { UserProfile } from "@/types/profile";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paintbrush } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVCardStyle } from "../VCardStyleContext";
import { toast } from "sonner";

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

  const handleStyleReset = () => {
    onStyleChange({
      custom_font: undefined,
      custom_background: undefined,
      custom_text_color: undefined,
      style_id: selectedStyle.id
    });
    toast.success("Style réinitialisé avec succès");
  };

  // Use custom styles or fall back to selected style
  const textColor = profile.custom_text_color || selectedStyle.colors.text.primary;
  const backgroundColor = profile.custom_background || selectedStyle.colors.background.card;
  const fontFamily = profile.custom_font || selectedStyle.font;

  return (
    <div 
      className="space-y-6 p-6 rounded-xl shadow-lg border bg-card"
      style={{ backgroundColor, color: textColor, fontFamily }}
    >
      <div className="flex items-center gap-2 border-b pb-4">
        <Paintbrush className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">
          Personnalisation du style
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-foreground">Police de caractères</Label>
          <Select
            value={profile.custom_font || selectedStyle.font}
            onValueChange={(value) => onStyleChange({ custom_font: value })}
          >
            <SelectTrigger 
              className="bg-background"
              style={{ fontFamily: profile.custom_font || selectedStyle.font }}
            >
              <SelectValue placeholder="Choisir une police" />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map((font) => (
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
          <Label className="text-foreground">Couleur de fond</Label>
          <Input
            type="color"
            value={profile.custom_background || selectedStyle.colors.background.card}
            onChange={(e) => onStyleChange({ custom_background: e.target.value })}
            className={cn(
              "h-10 px-2 py-1",
              "bg-background"
            )}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Couleur du texte</Label>
          <Input
            type="color"
            value={profile.custom_text_color || selectedStyle.colors.text.primary}
            onChange={(e) => onStyleChange({ custom_text_color: e.target.value })}
            className={cn(
              "h-10 px-2 py-1",
              "bg-background"
            )}
          />
        </div>

        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={handleStyleReset}
            className="w-full"
          >
            Réinitialiser le style
          </Button>
        </div>
      </div>
    </div>
  );
}