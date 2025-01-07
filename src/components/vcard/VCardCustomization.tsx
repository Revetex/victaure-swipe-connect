import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile } from "@/types/profile";

interface VCardCustomizationProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

export function VCardCustomization({ profile, setProfile }: VCardCustomizationProps) {
  return (
    <div className="space-y-4 p-4 bg-background/50 rounded-lg border">
      <h3 className="text-lg font-semibold">Personnalisation</h3>
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="custom-font">Police personnalisée</Label>
          <Input
            id="custom-font"
            value={profile.custom_font || ''}
            onChange={(e) => setProfile({ ...profile, custom_font: e.target.value })}
            placeholder="Nom de la police (ex: 'Roboto, sans-serif')"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="custom-background">Couleur de fond</Label>
          <div className="flex gap-2">
            <Input
              id="custom-background"
              value={profile.custom_background || ''}
              onChange={(e) => setProfile({ ...profile, custom_background: e.target.value })}
              placeholder="Code couleur (ex: #ffffff)"
            />
            <input
              type="color"
              value={profile.custom_background || '#ffffff'}
              onChange={(e) => setProfile({ ...profile, custom_background: e.target.value })}
              className="w-10 h-10 rounded"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="custom-text-color">Couleur du texte</Label>
          <div className="flex gap-2">
            <Input
              id="custom-text-color"
              value={profile.custom_text_color || ''}
              onChange={(e) => setProfile({ ...profile, custom_text_color: e.target.value })}
              placeholder="Code couleur (ex: #000000)"
            />
            <input
              type="color"
              value={profile.custom_text_color || '#000000'}
              onChange={(e) => setProfile({ ...profile, custom_text_color: e.target.value })}
              className="w-10 h-10 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}