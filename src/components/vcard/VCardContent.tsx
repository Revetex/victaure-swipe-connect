import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { VCardMainContent } from "./sections/VCardMainContent";
import { VCardExpandedContent } from "./sections/VCardExpandedContent";

interface VCardContentProps {
  profile: any;
  tempProfile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
  setTempProfile: (profile: any) => void;
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
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setIsExpanded(true);
    }
  }, [isEditing]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  return (
    <Card className={`transition-all duration-500 ease-out
      ${isExpanded ? 'fixed inset-4 z-50 m-auto max-h-[90vh] overflow-hidden' : 'w-full max-w-xl mx-auto hover:scale-[1.02]'}
      glass-card backdrop-blur-md border border-[#9b87f5]/10 shadow-2xl
      bg-gradient-to-br from-[#1A1F2C]/80 via-[#2A2F3C]/80 to-[#3A3F4C]/80
      hover:from-[#1A1F2C]/90 hover:via-[#2A2F3C]/90 hover:to-[#3A3F4C]/90
      ${isEditing ? 'editing-mode' : ''}`}>
      <CardContent className={`p-6 relative transition-all duration-500 h-full
        ${isExpanded ? 'overflow-hidden' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={isEditing ? "editing" : "viewing"}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className="space-y-6 h-full"
          >
            <VCardMainContent
              profile={tempProfile}
              isEditing={isEditing}
              setProfile={setTempProfile}
              setIsEditing={setIsEditing}
              isExpanded={isExpanded}
            />

            <AnimatePresence>
              {isExpanded && (
                <VCardExpandedContent
                  isExpanded={isExpanded}
                  isEditing={isEditing}
                  profile={tempProfile}
                  setProfile={setTempProfile}
                  setIsExpanded={setIsExpanded}
                  newSkill={newSkill}
                  setNewSkill={setNewSkill}
                  onShare={onShare}
                  onDownload={onDownload}
                  onDownloadPDF={onDownloadPDF}
                  onCopyLink={onCopyLink}
                  onSave={onSave}
                  onApplyChanges={onApplyChanges}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}