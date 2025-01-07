import { UserProfile } from "@/types/profile";
import { ColorPicker } from "./ColorPicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";

interface VCardCustomizationProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

export function VCardCustomization({ profile, setProfile }: VCardCustomizationProps) {
  const isMobile = useIsMobile();
  
  const fonts = [
    { value: "Inter", label: "Inter" },
    { value: "Roboto", label: "Roboto" },
    { value: "Poppins", label: "Poppins" },
    { value: "Montserrat", label: "Montserrat" },
  ];

  return (
    <div className={`space-y-6 ${isMobile ? 'px-4' : ''}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Police</Label>
          <Select
            value={profile.custom_font || "Inter"}
            onValueChange={(value) => setProfile({ ...profile, custom_font: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fonts.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Couleur de fond</Label>
          <ColorPicker
            color={profile.custom_background || "#ffffff"}
            onChange={(color) => setProfile({ ...profile, custom_background: color })}
          />
        </div>

        <div className="space-y-2">
          <Label>Couleur du texte</Label>
          <ColorPicker
            color={profile.custom_text_color || "#000000"}
            onChange={(color) => setProfile({ ...profile, custom_text_color: color })}
          />
        </div>
      </div>
    </div>
  );
}