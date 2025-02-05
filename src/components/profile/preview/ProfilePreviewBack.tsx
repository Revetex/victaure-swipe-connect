import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";

interface ProfilePreviewBackProps {
  profile: UserProfile;
  onFlip: () => void;
}

export function ProfilePreviewBack({ profile, onFlip }: ProfilePreviewBackProps) {
  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-[#1A1F2C] to-[#403E43] text-white rounded-lg shadow-xl">
      <div className="text-center space-y-4">
        <img
          src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png"
          alt="Logo"
          className="w-24 h-24 mx-auto opacity-20"
        />
        <div className="text-sm text-gray-300">
          <p>Membre depuis {new Date(profile.created_at || '').toLocaleDateString()}</p>
          <p>{profile.role === 'professional' ? 'Professionnel' : 'Employeur'}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        className="w-full mt-2 text-white hover:text-white/80 hover:bg-white/10"
        onClick={onFlip}
      >
        Retourner la carte
      </Button>
    </div>
  );
}