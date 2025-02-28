
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, MapPin, RotateCcw, X } from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface ProfilePreviewFrontProps {
  profile: UserProfile;
  onRequestChat?: () => void;
  onFlip: () => void;
  canViewFullProfile: boolean;
  onViewProfile?: () => void;
  hideCloseButton?: boolean;
  isDialog?: boolean;
}

export function ProfilePreviewFront({ 
  profile, 
  onRequestChat, 
  onFlip, 
  canViewFullProfile,
  onViewProfile,
  hideCloseButton = false,
  isDialog = false
}: ProfilePreviewFrontProps) {
  const onlineStatus = profile?.online_status || false;
  const joinDate = profile?.created_at 
    ? format(new Date(profile.created_at), 'MMMM yyyy', { locale: fr })
    : null;

  // Compte le nombre de domaines pour lesquels on a des informations
  const getCompletionPercentage = () => {
    const domains = [
      Boolean(profile.bio),
      Boolean(profile.skills && profile.skills.length > 0),
      Boolean(profile.education && profile.education.length > 0),
      Boolean(profile.experiences && profile.experiences.length > 0),
      Boolean(profile.certifications && profile.certifications.length > 0),
      Boolean(profile.city),
      Boolean(profile.phone)
    ];
    
    const completedDomains = domains.filter(Boolean).length;
    return Math.round((completedDomains / domains.length) * 100);
  };

  return (
    <div className={cn(
      "absolute inset-0 h-full w-full backface-hidden", 
      "overflow-auto",
      "flex flex-col"
    )}>
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-r from-primary/80 to-primary">
        {!hideCloseButton && (
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute top-2 right-2 h-8 w-8 text-white hover:bg-white/20"
            onClick={onFlip}
          >
            <RotateCcw className="h-4 w-4" />
            <span className="sr-only">Retourner</span>
          </Button>
        )}
      </div>
      
      {/* Avatar and name */}
      <div className="flex flex-col items-center -mt-16 px-6 text-center">
        <div className="relative">
          <UserAvatar 
            user={{
              id: profile.id,
              name: profile.full_name || "",
              image: profile.avatar_url
            }}
            className="h-24 w-24 border-4 border-background shadow-md"
            fallbackClassName="text-xl"
          />
          <span 
            className={cn(
              "absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-background",
              onlineStatus ? "bg-green-500" : "bg-gray-400"
            )}
          />
        </div>
        
        <h2 className="text-xl font-semibold mt-3">{profile.full_name}</h2>
        
        {/* Role badge */}
        {profile.role && (
          <Badge variant="secondary" className="mt-1">
            {profile.role === 'professional' ? 'Professionnel' : 
             profile.role === 'business' ? 'Entreprise' : 
             profile.role === 'freelancer' ? 'Freelance' : 
             profile.role === 'student' ? 'Étudiant' : profile.role}
          </Badge>
        )}
      </div>
      
      {/* Profile info */}
      <div className="px-6 mt-4 space-y-4 flex-1">
        {/* Completion rate */}
        {canViewFullProfile && (
          <div className="text-center text-sm text-muted-foreground">
            <div className="w-full bg-muted rounded-full h-1.5 mt-1 mb-2">
              <div 
                className="bg-primary h-1.5 rounded-full" 
                style={{ width: `${getCompletionPercentage()}%` }}
              />
            </div>
            <p>Profil complété à {getCompletionPercentage()}%</p>
          </div>
        )}
        
        {/* Bio */}
        {profile.bio && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {profile.bio.length > 150
                ? `${profile.bio.substring(0, 150)}...`
                : profile.bio}
            </p>
          </div>
        )}
        
        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Compétences</h3>
            <div className="flex flex-wrap gap-1">
              {profile.skills.slice(0, 4).map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-background">
                  {skill}
                </Badge>
              ))}
              {profile.skills.length > 4 && (
                <Badge variant="outline" className="bg-background">
                  +{profile.skills.length - 4}
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Contact */}
        <div className="space-y-2">
          {profile.email && (
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">{profile.email}</span>
            </div>
          )}
          
          {profile.city && (
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">
                {profile.city}
                {profile.state && `, ${profile.state}`}
                {profile.country && `, ${profile.country}`}
              </span>
            </div>
          )}
          
          {joinDate && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">
                Membre depuis {joinDate}
              </span>
            </div>
          )}
        </div>
        
        {/* Message button */}
        {!isDialog && onRequestChat && (
          <Button 
            className="w-full"
            onClick={onRequestChat}
          >
            <Mail className="h-4 w-4 mr-2" />
            Envoyer un message
          </Button>
        )}

        {/* View profile button */}
        {!isDialog && onViewProfile && (
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={onViewProfile}
          >
            Voir le profil complet
          </Button>
        )}
      </div>
    </div>
  );
}
