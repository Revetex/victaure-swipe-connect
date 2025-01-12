import { UserProfile } from "@/types/profile";
import { Input } from "./ui/input";
import { Phone, MapPin, Globe, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VCardContactProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  customStyles?: {
    font?: string;
    background?: string;
    textColor?: string;
  };
}

export function VCardContact({ profile, isEditing, setProfile, customStyles }: VCardContactProps) {
  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const ContactItem = ({ icon: Icon, value, label }: { icon: any, value?: string | null, label: string }) => {
    if (!value && !isEditing) return null;
    
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {isEditing ? (
          <Input
            type="text"
            value={value || ""}
            onChange={(e) => handleChange(label.toLowerCase() as keyof UserProfile, e.target.value)}
            placeholder={label}
            className="flex-1"
          />
        ) : (
          <span className="text-sm">{value}</span>
        )}
      </div>
    );
  };

  return (
    <div 
      className={cn(
        "space-y-4 p-6 rounded-lg border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "transition-all duration-200"
      )}
      style={{ 
        fontFamily: customStyles?.font,
        backgroundColor: customStyles?.background,
        color: customStyles?.textColor,
      }}
    >
      <div className="grid gap-4">
        <ContactItem icon={Mail} value={profile.email} label="Email" />
        <ContactItem icon={Phone} value={profile.phone} label="Phone" />
        <ContactItem 
          icon={MapPin} 
          value={[profile.city, profile.state, profile.country].filter(Boolean).join(", ")} 
          label="Location" 
        />
        <ContactItem icon={Globe} value={profile.website} label="Website" />
      </div>
    </div>
  );
}