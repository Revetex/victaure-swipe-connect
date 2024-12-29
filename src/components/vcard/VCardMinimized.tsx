import { Mail, Phone, MapPin, QrCode, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VCardMinimizedProps {
  profile: any;
  onExpand: () => void;
  onEdit: () => void;
}

export function VCardMinimized({ profile, onExpand, onEdit }: VCardMinimizedProps) {
  return (
    <div className="glass-card p-6 relative overflow-hidden">
      {/* Gradient decorative elements */}
      <div className="absolute right-0 top-0 h-32 w-32 bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl" />
      <div className="absolute left-0 bottom-0 h-32 w-32 bg-gradient-to-tr from-secondary/10 to-primary/10 blur-2xl" />
      
      {/* Content container with backdrop blur */}
      <div className="relative z-10">
        {/* Header with name and edit button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              {profile.full_name || "Nom non défini"}
            </h3>
            {profile.title && (
              <p className="text-sm text-muted-foreground mt-1">
                {profile.title}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Two-column layout */}
        <div className="flex gap-8">
          {/* Contact info */}
          <div className="flex-1 space-y-3">
            {profile.email && (
              <div className="flex items-center gap-3 group">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors truncate">
                  {profile.email}
                </span>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-3 group">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {profile.phone}
                </span>
              </div>
            )}
            {profile.city && (
              <div className="flex items-center gap-3 group">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {profile.city}
                </span>
              </div>
            )}
          </div>

          {/* QR Code section */}
          <div 
            onClick={onExpand}
            className="flex flex-col items-center justify-center border-l border-border pl-8 cursor-pointer group"
          >
            <div className="p-3 rounded-xl bg-background/50 border border-border group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300">
              <QrCode className="h-16 w-16 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-xs text-muted-foreground mt-2 group-hover:text-primary transition-colors">
              Scanner pour plus
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}