
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar, MapPin, Briefcase, Phone, Mail } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ProfilePreviewBackProps {
  profile: UserProfile;
  onFlip: () => void;
  onRequestChat?: () => void;
}

export function ProfilePreviewBack({ profile, onFlip, onRequestChat }: ProfilePreviewBackProps) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Date inconnue";
    return format(new Date(dateString), "d MMMM yyyy", { locale: fr });
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-[#1A1F2C] to-[#403E43] text-white rounded-lg shadow-xl min-h-[320px] w-full">
      <div className="text-center space-y-4">
        <img
          src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png"
          alt="Logo"
          className="w-20 h-20 mx-auto object-contain opacity-80"
        />
        <div className="text-sm text-gray-300 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            <p>Membre depuis {formatDate(profile.created_at)}</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Briefcase className="w-4 h-4" />
            <p>{profile.role === 'professional' ? 'Professionnel' : 'Employeur'}</p>
          </div>
          {profile.city && profile.country && (
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4" />
              <p>{profile.city}, {profile.country}</p>
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              <p>{profile.phone}</p>
            </div>
          )}
          {profile.email && (
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              <p>{profile.email}</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {onRequestChat && (
          <Button
            variant="secondary"
            className="w-full text-white hover:text-white/80 hover:bg-white/10"
            onClick={onRequestChat}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Démarrer une conversation
          </Button>
        )}

        <Button
          variant="ghost"
          className="w-full text-white hover:text-white/80 hover:bg-white/10"
          onClick={onFlip}
        >
          Retourner la carte
        </Button>
      </div>
    </div>
  );
}
