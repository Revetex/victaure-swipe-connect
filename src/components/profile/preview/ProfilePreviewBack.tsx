
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
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
          className="w-24 h-24 mx-auto object-contain"
          style={{ opacity: 0.8 }}
        />
        <div className="text-sm text-gray-300 space-y-2">
          <p>Membre depuis {formatDate(profile.created_at)}</p>
          <p>{profile.role === 'professional' ? 'Professionnel' : 'Employeur'}</p>
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
