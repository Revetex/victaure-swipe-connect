import { Mail, Phone, MapPin, QrCode, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VCardMinimizedProps {
  profile: any;
  onExpand: () => void;
  onEdit: () => void;
}

export function VCardMinimized({ profile, onExpand, onEdit }: VCardMinimizedProps) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-white/40 to-white/10 dark:from-gray-900/40 dark:to-gray-900/10 p-6 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
      <div className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-2xl" />
      
      {/* Header with name and edit button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{profile.full_name || "Nom non défini"}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="h-8 w-8"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6">
        {/* Contact info */}
        <div className="flex-1 space-y-2">
          {profile.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0" />
              <span className="truncate">{profile.email}</span>
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 shrink-0" />
              <span>{profile.phone}</span>
            </div>
          )}
          {profile.city && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{profile.city}</span>
            </div>
          )}
        </div>

        {/* QR Code section */}
        <div 
          className="flex flex-col items-center justify-center border-l border-border pl-6"
          onClick={onExpand}
        >
          <QrCode className="h-16 w-16 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
          <span className="text-xs text-muted-foreground mt-2">Scanner pour plus</span>
        </div>
      </div>
    </div>
  );
}