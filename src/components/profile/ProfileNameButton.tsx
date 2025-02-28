import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProfilePreview } from "@/components/ProfilePreview";
import { UserProfile } from "@/types/profile";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
interface ProfileNameButtonProps {
  profile: Partial<UserProfile> & {
    id: string;
    full_name: string | null;
  };
  className?: string;
}
export function ProfileNameButton({
  profile,
  className
}: ProfileNameButtonProps) {
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const handleViewProfile = () => {
    navigate(`/profile/${profile.id}`);
    setShowPreview(false);
  };
  return <>
      <Button variant="link" onClick={() => setShowPreview(true)} className="bg-transparent text-left rounded-none px-0 mx-0 my-0 py-0 text-emerald-200 font-light text-sm">
        {profile.full_name || "Utilisateur"}
      </Button>

      <ProfilePreview profile={profile as UserProfile} isOpen={showPreview} onClose={() => setShowPreview(false)} onRequestChat={() => navigate(`/messages?receiver=${profile.id}`)} />
    </>;
}