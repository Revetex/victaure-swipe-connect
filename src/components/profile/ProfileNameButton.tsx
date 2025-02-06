
import { useState } from "react";
import { ProfilePreview } from "@/components/ProfilePreview";
import { UserProfile } from "@/types/profile";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileNameButtonProps {
  profile: Partial<UserProfile> & { 
    id: string; 
    full_name: string | null;
    display_name?: string | null; 
  };
  className?: string;
}

export function ProfileNameButton({ profile, className }: ProfileNameButtonProps) {
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const displayName = profile.display_name || profile.full_name || "Utilisateur";

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={() => setShowPreview(true)}
        className={cn(
          "cursor-pointer text-primary/90 hover:text-primary",
          "transition-colors duration-200",
          "hover:underline underline-offset-4",
          "focus:outline-none focus:ring-2 focus:ring-primary/20",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        aria-label={`Voir le profil de ${displayName}`}
      >
        {displayName}
      </button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate('/settings')}
        className="text-muted-foreground hover:text-primary"
        aria-label="Paramètres"
      >
        <Settings className="h-4 w-4" />
      </Button>

      {showPreview && (
        <ProfilePreview
          profile={profile as UserProfile}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
