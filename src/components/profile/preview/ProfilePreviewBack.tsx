
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ProfilePreviewBackProps {
  profile: UserProfile;
  onFlip: () => void;
}

export function ProfilePreviewBack({ profile, onFlip }: ProfilePreviewBackProps) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Date inconnue";
    return format(new Date(dateString), "d MMMM yyyy", { locale: fr });
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-background/95 to-muted/90 backdrop-blur-sm border border-border/10 rounded-lg shadow-lg">
      <div className="text-center space-y-6">
        <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-muted/30 to-muted p-0.5">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 animate-pulse" />
          <img
            src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png"
            alt="Logo"
            className="w-full h-full object-contain p-4 rounded-full bg-background/80"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <p>Membre depuis {formatDate(profile.created_at)}</p>
          </div>
          
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
            {profile.role === 'professional' ? 'Professionnel' : 'Employeur'}
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        className="w-full text-muted-foreground hover:text-foreground hover:bg-muted/5"
        onClick={onFlip}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retourner la carte
      </Button>
    </div>
  );
}
