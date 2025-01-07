import { UserProfile } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VCardCustomizationProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

export function VCardCustomization({ profile, setProfile }: VCardCustomizationProps) {
  return (
    <div className="space-y-4 p-4 bg-accent/10 rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="font">Police personnalisée</Label>
        <Input
          id="font"
          value={profile.custom_font || ""}
          onChange={(e) => setProfile({ ...profile, custom_font: e.target.value })}
          placeholder="Ex: Arial, sans-serif"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="background">Couleur de fond</Label>
        <div className="flex gap-2">
          <Input
            id="background"
            type="color"
            value={profile.custom_background || "#ffffff"}
            onChange={(e) => setProfile({ ...profile, custom_background: e.target.value })}
            className="w-12"
          />
          <Input
            value={profile.custom_background || ""}
            onChange={(e) => setProfile({ ...profile, custom_background: e.target.value })}
            placeholder="Ex: #ffffff ou rgb(255, 255, 255)"
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="textColor">Couleur du texte</Label>
        <div className="flex gap-2">
          <Input
            id="textColor"
            type="color"
            value={profile.custom_text_color || "#000000"}
            onChange={(e) => setProfile({ ...profile, custom_text_color: e.target.value })}
            className="w-12"
          />
          <Input
            value={profile.custom_text_color || ""}
            onChange={(e) => setProfile({ ...profile, custom_text_color: e.target.value })}
            placeholder="Ex: #000000 ou rgb(0, 0, 0)"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}