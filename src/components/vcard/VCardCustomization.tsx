import { UserProfile } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paintbrush } from "lucide-react";

interface VCardCustomizationProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

export function VCardCustomization({ profile, setProfile }: VCardCustomizationProps) {
  return (
    <div className="space-y-4 p-4 bg-white/5 rounded-lg backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <Paintbrush className="h-4 w-4 text-indigo-400" />
        <h3 className="text-sm font-medium">Personnalisation</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="custom_font">Police</Label>
          <Input
            id="custom_font"
            value={profile.custom_font || ""}
            onChange={(e) => setProfile({ ...profile, custom_font: e.target.value })}
            placeholder="Police personnalisée"
            className="bg-white/10 border-indigo-500/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom_background">Arrière-plan</Label>
          <Input
            id="custom_background"
            type="color"
            value={profile.custom_background || "#000000"}
            onChange={(e) => setProfile({ ...profile, custom_background: e.target.value })}
            className="bg-white/10 border-indigo-500/20 h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom_text_color">Couleur du texte</Label>
          <Input
            id="custom_text_color"
            type="color"
            value={profile.custom_text_color || "#ffffff"}
            onChange={(e) => setProfile({ ...profile, custom_text_color: e.target.value })}
            className="bg-white/10 border-indigo-500/20 h-10"
          />
        </div>
      </div>
    </div>
  );
}