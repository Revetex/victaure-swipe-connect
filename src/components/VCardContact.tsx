import { Mail, Phone, MapPin } from "lucide-react";

interface VCardContactProps {
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
}

export function VCardContact({ email, phone, city, state }: VCardContactProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Contact</h3>
      <div className="space-y-2">
        {email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a href={`mailto:${email}`} className="text-sm hover:underline">
              {email}
            </a>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <a href={`tel:${phone}`} className="text-sm hover:underline">
              {phone}
            </a>
          </div>
        )}
        {(city || state) && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {[city, state].filter(Boolean).join(", ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}