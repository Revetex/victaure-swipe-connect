import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
export interface ProfilePreviewBackProps {
  profile: UserProfile;
  onFlip: () => void;
  canViewFullProfile: boolean;
}
export function ProfilePreviewBack({
  profile,
  onFlip,
  canViewFullProfile
}: ProfilePreviewBackProps) {
  return <div style={{
    transform: "rotateY(180deg)"
  }} className="">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold">Détails du profil</h2>
        <Button size="icon" variant="ghost" onClick={onFlip} className="h-8 w-8 rounded-full bg-background/30 hover:bg-background/50">
          <RotateCcw className="h-4 w-4" />
          <span className="sr-only">Retourner</span>
        </Button>
      </div>

      <div className="space-y-4 flex-1">
        {/* Informations supplémentaires */}
        {profile.bio && <div>
            <h3 className="text-sm font-medium mb-1">À propos</h3>
            <p className="text-sm text-muted-foreground">{profile.bio}</p>
          </div>}

        {/* Compétences */}
        {profile.skills && profile.skills.length > 0 && <div>
            <h3 className="text-sm font-medium mb-1">Compétences</h3>
            <div className="flex flex-wrap gap-1">
              {profile.skills.map((skill, index) => <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {skill}
                </span>)}
            </div>
          </div>}

        {/* Coordonnées */}
        <div>
          <h3 className="text-sm font-medium mb-1">Coordonnées</h3>
          <div className="space-y-1 text-sm">
            {profile.email && <p className="text-muted-foreground">{profile.email}</p>}
            {profile.phone && <p className="text-muted-foreground">{profile.phone}</p>}
            {profile.city && <p className="text-muted-foreground">
                {profile.city}
                {profile.state && `, ${profile.state}`}
                {profile.country && `, ${profile.country}`}
              </p>}
          </div>
        </div>

        {/* Message si profil privé */}
        {!canViewFullProfile && <div className="bg-muted p-3 rounded-md text-sm text-muted-foreground mt-2">
            Ce profil est privé. Certaines informations ne sont pas visibles.
          </div>}
      </div>
    </div>;
}