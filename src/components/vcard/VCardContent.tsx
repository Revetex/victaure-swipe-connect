import { VCardHeader } from "@/components/VCardHeader";
import { VCardContactInfo } from "./VCardContactInfo";
import { VCardSkills } from "@/components/VCardSkills";
import { VCardCertifications } from "@/components/VCardCertifications";
import { VCardEducation } from "@/components/VCardEducation";
import { VCardSection } from "@/components/VCardSection";
import { motion } from "framer-motion";
import { QrCode, Share2, Minimize, FileText, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
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
  const handleAddSkill = () => {
    if (newSkill && !tempProfile.skills?.includes(newSkill)) {
      setTempProfile({
        ...tempProfile,
        skills: [...(tempProfile.skills || []), newSkill],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setTempProfile({
      ...tempProfile,
      skills: tempProfile.skills?.filter((skill) => skill !== skillToRemove),
    });
  };

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
              email={profile.email}
              phone={profile.phone}
              city={profile.city}
              state={profile.state}
            />
            <VCardSkills
              profile={isEditing ? tempProfile : profile}
              isEditing={isEditing}
              setProfile={setTempProfile}
              newSkill={newSkill}
              setNewSkill={setNewSkill}
              handleAddSkill={handleAddSkill}
              handleRemoveSkill={handleRemoveSkill}
            />
            <VCardSection title="Certifications" icon={<FileText className="h-4 w-4" />}>
              <VCardCertifications
                profile={isEditing ? tempProfile : profile}
                isEditing={isEditing}
                setProfile={setTempProfile}
              />
            </VCardSection>
            <VCardSection title="Formation" icon={<GraduationCap className="h-4 w-4" />}>
              <VCardEducation
                profile={isEditing ? tempProfile : profile}
                isEditing={isEditing}
                setProfile={setTempProfile}
              />
            </VCardSection>
          </div>
        </motion.div>
      </div>
      <div className="w-full md:w-48 space-y-2">
        <motion.div 
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col items-center space-y-4">
            <QRCodeSVG
              value={window.location.href}
              size={160}
              level="H"
              includeMargin={false}
              className="rounded-lg"
            />
            <div className="w-full space-y-2">
              <Button
                onClick={onShare}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Partager
              </Button>
              <Button
                onClick={onDownloadPDF}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <FileText className="h-4 w-4" />
                CV PDF
              </Button>
              <Button
                onClick={onDownloadBusinessPDF}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <QrCode className="h-4 w-4" />
                VCard PDF
              </Button>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <Minimize className="h-4 w-4" />
                {isEditing ? "Réduire" : "Éditer"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}