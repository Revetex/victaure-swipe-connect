import { Mail, Phone, MapPin } from "lucide-react";

interface VCardContactInfoProps {
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
}

export function VCardContactInfo({ email, phone, city, state }: VCardContactInfoProps) {
  return (
    <div className="mt-4 space-y-2.5">
      {email && (
        <div className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Mail className="h-4 w-4" />
          <span>{email}</span>
        </div>
      )}
      {phone && (
        <div className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Phone className="h-4 w-4" />
          <span>{phone}</span>
        </div>
      )}
      {city && (
        <div className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <MapPin className="h-4 w-4" />
          <span>{city}, {state || 'Canada'}</span>
        </div>
      )}
    </div>
  );
}