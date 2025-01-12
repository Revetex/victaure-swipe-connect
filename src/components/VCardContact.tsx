import { UserProfile } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Globe, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VCardContactProps {
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

  const contactFields = [
    { icon: Mail, label: "Email", value: profile.email },
    { icon: Phone, label: "Phone", value: profile.phone },
    { icon: MapPin, label: "City", value: profile.city },
    { icon: Building2, label: "Company", value: profile.company_name },
    { icon: Globe, label: "Website", value: profile.website },
  ];

  const renderContactField = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | null }) => {
    return (
      <div key={label} className="flex items-center gap-3">
        <Icon className={cn(
          "h-4 w-4",
          customStyles?.textColor ? "" : "text-muted-foreground"
        )} />
        {isEditing ? (
          <Input
            value={value || ""}
            onChange={(e) => handleChange(label.toLowerCase() as keyof UserProfile, e.target.value)}
            placeholder={label}
            className="flex-1 bg-background text-foreground"
          />
        ) : (
          <span className={cn(
            "text-sm",
            customStyles?.textColor ? "" : "text-foreground"
          )}>{value || `Aucun ${label.toLowerCase()}`}</span>
        )}
      </div>
    );
  };

  return (
    <div 
      className={cn(
        "space-y-4 p-6 rounded-lg border",
        isEditing ? "bg-card shadow-lg" : "bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}
      style={{ 
        fontFamily: customStyles?.font,
        backgroundColor: !isEditing ? customStyles?.background : undefined,
        color: customStyles?.textColor,
      }}
    >
      <h2 className={cn(
        "text-lg font-semibold mb-4",
        customStyles?.textColor ? "" : "text-foreground"
      )}>Contact</h2>
      <div className="space-y-4">
        {contactFields.map(renderContactField)}
      </div>
    </div>
  );
}