import { VCardHeader } from "@/components/VCardHeader";
import { VCardActions } from "@/components/VCardActions";
import { VCardContactInfo } from "./VCardContactInfo";
import { VCardSkills } from "@/components/VCardSkills";
import { VCardCertifications } from "@/components/VCardCertifications";
import { VCardEducation } from "@/components/VCardEducation";
import { VCardSection } from "@/components/VCardSection";
import { VCardBadge } from "@/components/VCardBadge";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/profile";

interface VCardContentProps {
  profile: UserProfile;
  tempProfile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  setTempProfile: (profile: UserProfile) => void;
  setIsEditing: (isEditing: boolean) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  onShare: () => void;
  onDownload: () => void;
  onDownloadPDF: () => void;
  onDownloadBusinessPDF: () => void;
  onCopyLink: () => void;
  onSave: () => void;
  onApplyChanges: () => void;
}

export function VCardContent({
  profile,
  tempProfile,
  isEditing,
  setProfile,
  setTempProfile,
  setIsEditing,
  newSkill,
  setNewSkill,
  onShare,
  onDownload,
  onDownloadPDF,
  onDownloadBusinessPDF,
  onCopyLink,
  onSave,
  onApplyChanges,
}: VCardContentProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-6 space-y-6">
            <VCardHeader
              profile={isEditing ? tempProfile : profile}
              isEditing={isEditing}
              setProfile={setTempProfile}
              setIsEditing={setIsEditing}
            />
            <VCardContactInfo
              profile={isEditing ? tempProfile : profile}
              isEditing={isEditing}
              setProfile={setTempProfile}
            />
            <VCardSkills
              profile={isEditing ? tempProfile : profile}
              isEditing={isEditing}
              setProfile={setTempProfile}
              newSkill={newSkill}
              setNewSkill={setNewSkill}
            />
            <VCardSection title="Certifications">
              <VCardCertifications
                profile={isEditing ? tempProfile : profile}
                isEditing={isEditing}
                setProfile={setTempProfile}
              />
            </VCardSection>
            <VCardSection title="Formation">
              <VCardEducation
                profile={isEditing ? tempProfile : profile}
                isEditing={isEditing}
                setProfile={setTempProfile}
              />
            </VCardSection>
            <VCardActions
              isEditing={isEditing}
              onShare={onShare}
              onDownload={onDownload}
              onDownloadPDF={onDownloadPDF}
              onCopyLink={onCopyLink}
              onSave={onSave}
              onApplyChanges={onApplyChanges}
            />
          </div>
        </motion.div>
      </div>
      <div className="w-full md:w-48 space-y-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsEditing(!isEditing)}
          className="w-full p-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
        >
          {isEditing ? "Annuler" : "Éditer"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDownloadPDF}
          className="w-full p-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
        >
          Télécharger CV PDF
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDownloadBusinessPDF}
          className="w-full p-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
        >
          Télécharger Business VCard PDF
        </motion.button>
      </div>
    </div>
  );
}