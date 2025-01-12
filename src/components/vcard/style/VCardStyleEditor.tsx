import { UserProfile } from "@/types/profile";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paintbrush } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  return (
    <div className="space-y-6 p-6 bg-card rounded-xl shadow-lg backdrop-blur-sm border">
      <div className="flex items-center gap-2 border-b pb-4">
        <Paintbrush className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Personnalisation du style</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Police de caractères</Label>
          <Select
            value={profile.custom_font || ""}
            onValueChange={(value) => onStyleChange({ custom_font: value })}
          >
            <SelectTrigger className="bg-background/50 border-border/50">
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
          <Label>Couleur de fond</Label>
          <Input
            type="color"
            value={profile.custom_background || "#ffffff"}
            onChange={(e) => onStyleChange({ custom_background: e.target.value })}
            className={cn(
              "h-10 px-2 py-1",
              "bg-background/50 border-border/50"
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Couleur du texte</Label>
          <Input
            type="color"
            value={profile.custom_text_color || "#000000"}
            onChange={(e) => onStyleChange({ custom_text_color: e.target.value })}
            className={cn(
              "h-10 px-2 py-1",
              "bg-background/50 border-border/50"
            )}
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
          >
            Réinitialiser le style
          </Button>
        </div>
      </div>
    </div>
  );
}