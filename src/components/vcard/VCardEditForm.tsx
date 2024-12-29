import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserProfile } from "@/types/profile";
import { Mail, Phone, MapPin, Building2, Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { quebecCities } from "@/data/cities";

interface VCardEditFormProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

export function VCardEditForm({ profile, setProfile }: VCardEditFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <Input
            value={profile.email || ""}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            placeholder="Email"
            type="email"
          />
        </div>

        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <Input
            value={profile.phone || ""}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            placeholder="Téléphone"
            type="tel"
          />
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <Select
            value={profile.city || ""}
            onValueChange={(value) => setProfile({ ...profile, city: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une ville" />
            </SelectTrigger>
            <SelectContent>
              {quebecCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <Select
            value={profile.state || ""}
            onValueChange={(value) => setProfile({ ...profile, state: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une province" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Québec">Québec</SelectItem>
              <SelectItem value="Ontario">Ontario</SelectItem>
              <SelectItem value="Alberta">Alberta</SelectItem>
              <SelectItem value="Colombie-Britannique">
                Colombie-Britannique
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <Textarea
            value={profile.bio || ""}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="Biographie"
            className="min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
}