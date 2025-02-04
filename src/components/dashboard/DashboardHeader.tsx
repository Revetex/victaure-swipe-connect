import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";
import { GoogleSearchBox } from "@/components/google-search/GoogleSearchBox";

export function DashboardHeader() {
  const { profile } = useProfile();

  if (!profile) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 p-6 rounded-2xl bg-card shadow-lg border border-border/50 space-y-4"
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 ring-2 ring-primary/10">
          <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || 'Profile'} />
          <AvatarFallback>
            <UserCircle className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {profile.full_name || 'Bienvenue'}
          </h1>
          <p className="text-muted-foreground">
            {profile.bio ? profile.bio.substring(0, 100) + '...' : 'Complétez votre profil pour commencer'}
          </p>
        </div>
      </div>
      <GoogleSearchBox />
    </motion.div>
  );
}