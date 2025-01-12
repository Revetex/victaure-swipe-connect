import { UserProfile } from "@/types/profile";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paintbrush } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVCardStyle } from "../VCardStyleContext";

interface VCardStyleEditorProps {
  profile: UserProfile;
  onStyleChange: (updates: Partial<UserProfile>) => void;
}

const fontOptions = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans' },
  { value: 'Lato, sans-serif', label: 'Lato' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' },
  { value: 'Poppins, sans-serif', label: 'Poppins' },
];

export function VCardStyleEditor({ profile, onStyleChange }: VCardStyleEditorProps) {
  const { selectedStyle } = useVCardStyle();

  return (
    <div 
      className="space-y-6 p-6 rounded-xl shadow-lg border"
      style={{
        backgroundColor: selectedStyle.colors.background.card,
        borderColor: `${selectedStyle.colors.primary}20`,
      }}
    >
      <div className="flex items-center gap-2 border-b pb-4" style={{ borderColor: `${selectedStyle.colors.primary}20` }}>
        <Paintbrush className="h-5 w-5" style={{ color: selectedStyle.colors.primary }} />
        <h3 className="text-lg font-medium" style={{ color: selectedStyle.colors.text.primary }}>
          Personnalisation du style
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label style={{ color: selectedStyle.colors.text.primary }}>Police de caractères</Label>
          <Select
            value={profile.custom_font || ""}
            onValueChange={(value) => onStyleChange({ custom_font: value })}
          >
            <SelectTrigger 
              className="bg-background/50"
              style={{ borderColor: `${selectedStyle.colors.primary}30` }}
            >
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
          <Label style={{ color: selectedStyle.colors.text.primary }}>Couleur de fond</Label>
          <Input
            type="color"
            value={profile.custom_background || "#ffffff"}
            onChange={(e) => onStyleChange({ custom_background: e.target.value })}
            className={cn(
              "h-10 px-2 py-1",
              "bg-background/50"
            )}
            style={{ borderColor: `${selectedStyle.colors.primary}30` }}
          />
        </div>

        <div className="space-y-2">
          <Label style={{ color: selectedStyle.colors.text.primary }}>Couleur du texte</Label>
          <Input
            type="color"
            value={profile.custom_text_color || selectedStyle.colors.text.primary}
            onChange={(e) => onStyleChange({ custom_text_color: e.target.value })}
            className={cn(
              "h-10 px-2 py-1",
              "bg-background/50"
            )}
            style={{ borderColor: `${selectedStyle.colors.primary}30` }}
          />
        </div>

        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={() => onStyleChange({
              custom_font: undefined,
              custom_background: undefined,
              custom_text_color: undefined
            })}
            className="w-full"
            style={{
              borderColor: selectedStyle.colors.primary,
              color: selectedStyle.colors.primary
            }}
          >
            Réinitialiser le style
          </Button>
        </div>
      </div>
    </div>
  );
}