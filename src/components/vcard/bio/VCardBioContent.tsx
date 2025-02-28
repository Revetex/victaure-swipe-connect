import { motion } from "framer-motion";
import { UserProfile } from "@/types/profile";

interface VCardBioContentProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardBioContent({ profile, isEditing, setProfile }: VCardBioContentProps) {
  return isEditing ? (
    <textarea
      value={profile?.bio || ""}
      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
      placeholder="Écrivez une courte présentation..."
      className="w-full min-h-[120px] p-3 rounded-lg bg-white/5 dark:bg-black/20 border border-gray-200/20 dark:border-white/10 text-sm sm:text-base text-gray-900 dark:text-white/90 placeholder:text-gray-500/50 dark:placeholder:text-white/30 focus:ring-1 focus:ring-primary/20 dark:focus:ring-white/20 focus:border-primary/30 dark:focus:border-white/30"
    />
  ) : profile?.bio ? (
    <p className="text-sm sm:text-base text-gray-700 dark:text-white/80 leading-relaxed">
      {profile.bio}
    </p>
  ) : null;
}