import { UserProfile } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserCircle, Mail, Phone, MapPin, Building2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVCardStyle } from "../VCardStyleContext";

interface VCardProfileEditorProps {
  profile: UserProfile;
  onProfileChange: (updates: Partial<UserProfile>) => void;
}

export function VCardProfileEditor({ profile, onProfileChange }: VCardProfileEditorProps) {
  const { selectedStyle } = useVCardStyle();

  // Use custom styles or fall back to selected style
  const textColor = profile.custom_text_color || selectedStyle.colors.text.primary;
  const backgroundColor = profile.custom_background || selectedStyle.colors.background.card;
  const fontFamily = profile.custom_font || selectedStyle.font;

  const inputStyles = {
    color: textColor,
    backgroundColor: backgroundColor,
    fontFamily: fontFamily,
  };

  return (
    <div 
      className="space-y-6 p-6 rounded-xl shadow-lg border bg-card"
      style={{ backgroundColor, color: textColor, fontFamily }}
    >
      <div className="flex items-center gap-2 border-b pb-4">
        <UserCircle className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium" style={{ color: textColor }}>
          Informations personnelles
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2" style={{ color: textColor }}>
            <UserCircle className="h-4 w-4" />
            Nom complet
          </Label>
          <Input
            value={profile.full_name || ""}
            onChange={(e) => onProfileChange({ full_name: e.target.value })}
            placeholder="Votre nom complet"
            className={cn(
              "bg-background/50 border-border/50",
              "focus:ring-2 focus:ring-primary/50"
            )}
            style={inputStyles}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2" style={{ color: textColor }}>
            <Mail className="h-4 w-4" />
            Email
          </Label>
          <Input
            value={profile.email || ""}
            onChange={(e) => onProfileChange({ email: e.target.value })}
            placeholder="Votre email"
            type="email"
            className={cn(
              "bg-background/50 border-border/50",
              "focus:ring-2 focus:ring-primary/50"
            )}
            style={inputStyles}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2" style={{ color: textColor }}>
            <Phone className="h-4 w-4" />
            Téléphone
          </Label>
          <Input
            value={profile.phone || ""}
            onChange={(e) => onProfileChange({ phone: e.target.value })}
            placeholder="Votre numéro de téléphone"
            type="tel"
            className={cn(
              "bg-background/50 border-border/50",
              "focus:ring-2 focus:ring-primary/50"
            )}
            style={inputStyles}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2" style={{ color: textColor }}>
            <Building2 className="h-4 w-4" />
            Entreprise
          </Label>
          <Input
            value={profile.company_name || ""}
            onChange={(e) => onProfileChange({ company_name: e.target.value })}
            placeholder="Nom de votre entreprise"
            className={cn(
              "bg-background/50 border-border/50",
              "focus:ring-2 focus:ring-primary/50"
            )}
            style={inputStyles}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2" style={{ color: textColor }}>
            <Globe className="h-4 w-4" />
            Site web
          </Label>
          <Input
            value={profile.website || ""}
            onChange={(e) => onProfileChange({ website: e.target.value })}
            placeholder="Votre site web"
            type="url"
            className={cn(
              "bg-background/50 border-border/50",
              "focus:ring-2 focus:ring-primary/50"
            )}
            style={inputStyles}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2" style={{ color: textColor }}>
            <MapPin className="h-4 w-4" />
            Ville
          </Label>
          <Input
            value={profile.city || ""}
            onChange={(e) => onProfileChange({ city: e.target.value })}
            placeholder="Votre ville"
            className={cn(
              "bg-background/50 border-border/50",
              "focus:ring-2 focus:ring-primary/50"
            )}
            style={inputStyles}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2" style={{ color: textColor }}>Bio</Label>
        <Textarea
          value={profile.bio || ""}
          onChange={(e) => onProfileChange({ bio: e.target.value })}
          placeholder="Décrivez votre parcours professionnel..."
          className={cn(
            "min-h-[150px]",
            "bg-background/50 border-border/50",
            "focus:ring-2 focus:ring-primary/50"
          )}
          style={inputStyles}
        />
      </div>
    </div>
  );
}