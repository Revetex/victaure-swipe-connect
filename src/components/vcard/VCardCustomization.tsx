import { UserProfile } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ColorPicker } from "./ColorPicker";

interface VCardCustomizationProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

export function VCardCustomization({ profile, setProfile }: VCardCustomizationProps) {
  const handleStyleChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <div className="space-y-6 p-6 bg-accent/10 rounded-lg border border-accent/20">
      <h3 className="text-lg font-semibold text-foreground/90">Personnalisation</h3>
      
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="font">Police d'écriture</Label>
          <Input
            id="font"
            value={profile.custom_font || ""}
            onChange={(e) => handleStyleChange('custom_font', e.target.value)}
            placeholder="Ex: Roboto, sans-serif"
            className="bg-background/50"
          />
          <p className="text-xs text-muted-foreground">
            Utilisez une police Google Fonts (ex: Roboto, Montserrat, etc.)
          </p>
        </div>

        <div className="space-y-2">
          <Label>Couleur du texte</Label>
          <ColorPicker
            color={profile.custom_text_color || "#000000"}
            onChange={(color) => handleStyleChange('custom_text_color', color)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>Couleur de fond</Label>
          <ColorPicker
            color={profile.custom_background || "#ffffff"}
            onChange={(color) => handleStyleChange('custom_background', color)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>Aperçu</Label>
          <div 
            className={cn(
              "p-4 rounded-lg border transition-all duration-200",
              "min-h-[100px] flex items-center justify-center text-center"
            )}
            style={{
              backgroundColor: profile.custom_background || 'white',
              color: profile.custom_text_color || 'black',
              fontFamily: profile.custom_font || 'inherit'
            }}
          >
            <p>Exemple de texte personnalisé</p>
          </div>
        </div>
      </div>
    </div>
  );
}