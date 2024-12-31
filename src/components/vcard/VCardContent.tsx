import { VCardHeader } from "@/components/VCardHeader";
import { VCardContactInfo } from "./VCardContactInfo";
import { VCardSkills } from "@/components/VCardSkills";
import { VCardCertifications } from "@/components/VCardCertifications";
import { VCardEducation } from "@/components/VCardEducation";
import { VCardSection } from "@/components/VCardSection";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import type { UserProfile } from "@/types/profile";
import { Button } from "../ui/button";
import { Share2, FileText, Edit2, X } from "lucide-react";

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
  onCopyLink,
  onSave,
  onApplyChanges,
}: VCardContentProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="absolute inset-0 bg-circuit-pattern opacity-10" />
        <div className="relative p-6">
          <div className="flex justify-between items-start gap-6">
            <div className="flex-1">
              <VCardHeader
                profile={isEditing ? tempProfile : profile}
                isEditing={isEditing}
                setProfile={setTempProfile}
                setIsEditing={setIsEditing}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="p-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <QRCodeSVG
                  value={window.location.href}
                  size={80}
                  level="H"
                  includeMargin={false}
                  className="rounded opacity-90"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={onShare}
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Partager
                </Button>
                <Button
                  onClick={onDownloadPDF}
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  CV PDF
                </Button>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center gap-2"
                >
                  {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                  {isEditing ? "Réduire" : "Éditer"}
                </Button>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <VCardContactInfo
              email={profile.email}
              phone={profile.phone}
              city={profile.city}
              state={profile.state}
            />
          </motion.div>

          {isEditing && (
            <div className="mt-8 space-y-8">
              <VCardSkills
                profile={isEditing ? tempProfile : profile}
                isEditing={isEditing}
                setProfile={setTempProfile}
                newSkill={newSkill}
                setNewSkill={setNewSkill}
                handleAddSkill={() => {
                  if (newSkill && !tempProfile.skills?.includes(newSkill)) {
                    setTempProfile({
                      ...tempProfile,
                      skills: [...(tempProfile.skills || []), newSkill],
                    });
                    setNewSkill("");
                  }
                }}
                handleRemoveSkill={(skillToRemove: string) => {
                  setTempProfile({
                    ...tempProfile,
                    skills: tempProfile.skills?.filter(
                      (skill: string) => skill !== skillToRemove
                    ),
                  });
                }}
              />
              <VCardSection title="Certifications" icon={<FileText className="h-4 w-4" />}>
                <VCardCertifications
                  profile={isEditing ? tempProfile : profile}
                  isEditing={isEditing}
                  setProfile={setTempProfile}
                />
              </VCardSection>
              <VCardSection title="Formation" icon={<FileText className="h-4 w-4" />}>
                <VCardEducation
                  profile={isEditing ? tempProfile : profile}
                  isEditing={isEditing}
                  setProfile={setTempProfile}
                />
              </VCardSection>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}