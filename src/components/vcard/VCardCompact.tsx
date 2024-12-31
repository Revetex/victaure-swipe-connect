import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserRound, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { VCardContactInfo } from "./VCardContactInfo";
import { VCardCompactActions } from "./VCardCompactActions";
import type { UserProfile } from "@/types/profile";

interface VCardCompactProps {
  profile: UserProfile;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  onExpand: () => void;
  onDownload: () => void;
  onDownloadPDF: () => void;
  onDownloadBusinessPDF: () => void;
}

export function VCardCompact({
  profile,
  isEditing,
  setIsEditing,
  onExpand,
  onDownload,
  onDownloadPDF,
  onDownloadBusinessPDF,
}: VCardCompactProps) {
  return (
    <div className="relative p-6 overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/5 shadow-lg backdrop-blur-md border border-white/10">
      <div className="absolute inset-0 bg-circuit-pattern opacity-5" />
      <div className="relative">
        <motion.div 
          className="flex flex-col sm:flex-row items-start gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Avatar className="h-16 w-16 ring-2 ring-background">
            <AvatarImage 
              src={profile.avatar_url || ""} 
              alt={profile.full_name || ""}
              className="object-cover"
            />
            <AvatarFallback className="bg-muted">
              <UserRound className="h-6 w-6 text-muted-foreground/50" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg font-semibold text-white"
            >
              {profile.full_name || "Nom non défini"}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-1.5 mt-1 text-white/80"
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span className="text-sm">
                {profile.role || "Rôle non défini"}
              </span>
            </motion.div>

            <VCardContactInfo
              email={profile.email}
              phone={profile.phone}
              city={profile.city}
              state={profile.state}
            />
          </div>
        </motion.div>

        {!isEditing && (
          <VCardCompactActions
            onExpand={onExpand}
            onEdit={() => setIsEditing(true)}
            onDownload={onDownload}
            onDownloadPDF={onDownloadPDF}
            onDownloadBusinessPDF={onDownloadBusinessPDF}
          />
        )}
      </div>
    </div>
  );
}