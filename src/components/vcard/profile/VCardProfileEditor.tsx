import { UserProfile } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserCircle, Mail, Phone, MapPin, Building2, Globe } from "lucide-react";

interface VCardProfileEditorProps {
  profile: UserProfile;
  onProfileChange: (updates: Partial<UserProfile>) => void;
}

export function VCardProfileEditor({ profile, onProfileChange }: VCardProfileEditorProps) {
  return (
    <div className="space-y-6 p-6 bg-card rounded-xl shadow-lg backdrop-blur-sm border">
      <div className="flex items-center gap-2 border-b pb-4">
        <UserCircle className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Informations personnelles</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <UserCircle className="h-4 w-4" />
            Nom complet
          </Label>
          <Input
            value={profile.full_name || ""}
            onChange={(e) => onProfileChange({ full_name: e.target.value })}
            placeholder="Votre nom complet"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Label>
          <Input
            value={profile.email || ""}
            onChange={(e) => onProfileChange({ email: e.target.value })}
            placeholder="Votre email"
            type="email"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Téléphone
          </Label>
          <Input
            value={profile.phone || ""}
            onChange={(e) => onProfileChange({ phone: e.target.value })}
            placeholder="Votre numéro de téléphone"
            type="tel"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Entreprise
          </Label>
          <Input
            value={profile.company_name || ""}
            onChange={(e) => onProfileChange({ company_name: e.target.value })}
            placeholder="Nom de votre entreprise"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Site web
          </Label>
          <Input
            value={profile.website || ""}
            onChange={(e) => onProfileChange({ website: e.target.value })}
            placeholder="Votre site web"
            type="url"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Ville
          </Label>
          <Input
            value={profile.city || ""}
            onChange={(e) => onProfileChange({ city: e.target.value })}
            placeholder="Votre ville"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">Bio</Label>
        <Textarea
          value={profile.bio || ""}
          onChange={(e) => onProfileChange({ bio: e.target.value })}
          placeholder="Décrivez votre parcours professionnel..."
          className="min-h-[150px]"
        />
      </div>
    </div>
  );
}