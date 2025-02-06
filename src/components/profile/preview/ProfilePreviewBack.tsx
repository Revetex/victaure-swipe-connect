import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface ProfilePreviewBackProps {
  profile: UserProfile;
  onFlip: () => void;
  onRequestChat?: () => void;
}

export function ProfilePreviewBack({ profile, onFlip, onRequestChat }: ProfilePreviewBackProps) {
  const formatDate = (date: string | undefined) => {
    if (!date) return "Date inconnue";
    return new Date(date).toLocaleDateString('fr-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-[#1A1F2C] to-[#403E43] text-white rounded-lg shadow-xl min-h-[320px]">
      <div className="text-center space-y-4">
        <img
          src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png"
          alt="Logo"
          className="w-24 h-24 mx-auto opacity-40 object-contain"
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