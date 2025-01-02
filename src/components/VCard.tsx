import { motion } from "framer-motion";
import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { VCardSkeleton } from "./vcard/VCardSkeleton";
import { VCardEmpty } from "./vcard/VCardEmpty";
import { Card, CardContent } from "@/components/ui/card";
import { VCardHeader } from "./VCardHeader";
import { VCardContact } from "./VCardContact";
import { VCardSkills } from "./VCardSkills";
import { VCardCertifications } from "./VCardCertifications";
import { VCardEducation } from "./VCardEducation";
import { VCardActions } from "./VCardActions";
import { Button } from "./ui/button";
import { MessageSquare, Download, QrCode } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { generateVCardPDF } from "@/utils/pdfGenerator";

interface VCardProps {
  onEditStateChange?: (isEditing: boolean) => void;
  onRequestChat?: () => void;
}

export function VCardComponent({ onEditStateChange, onRequestChat }: VCardProps) {
  const { profile, isLoading } = useProfile();
  const [showQR, setShowQR] = useState(false);

  const handleEditRequest = () => {
    toast.info("Pour modifier votre profil, discutez avec M. Victaure !");
    if (onRequestChat) {
      onRequestChat();
    }
  };

  const handleDownloadPDF = async () => {
    if (!profile) return;
    try {
      await generateVCardPDF(profile);
      toast.success("PDF téléchargé avec succès");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };

  if (isLoading) {
    return <VCardSkeleton />;
  }

  if (!profile) {
    return <VCardEmpty />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="border-none shadow-lg bg-gradient-to-br from-[#9b87f5] to-[#7E69AB]">
        <CardContent className="p-6 space-y-8">
          <VCardHeader
            profile={profile}
            isEditing={false}
            setProfile={() => {}}
          />

          <VCardContact
            profile={profile}
            isEditing={false}
            setProfile={() => {}}
          />

          <motion.div 
            className="space-y-8 pt-6"
          >
            <VCardSkills
              profile={profile}
              isEditing={false}
              setProfile={() => {}}
              newSkill=""
              setNewSkill={() => {}}
              handleAddSkill={() => {}}
              handleRemoveSkill={() => {}}
            />

            <VCardCertifications
              profile={profile}
              isEditing={false}
              setProfile={() => {}}
            />

            <VCardEducation
              profile={profile}
              isEditing={false}
              setProfile={() => {}}
            />

            <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-white/20">
              <Button
                onClick={handleEditRequest}
                className="bg-white hover:bg-white/90 text-[#7E69AB] transition-colors"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Modifier mon profil
              </Button>

              <Button
                onClick={handleDownloadPDF}
                className="bg-white hover:bg-white/90 text-[#7E69AB] transition-colors"
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger PDF
              </Button>

              <Button
                onClick={() => setShowQR(!showQR)}
                className="bg-white hover:bg-white/90 text-[#7E69AB] transition-colors"
              >
                <QrCode className="mr-2 h-4 w-4" />
                {showQR ? 'Masquer QR' : 'Afficher QR'}
              </Button>
            </div>

            {showQR && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-center pt-4"
              >
                <div className="p-4 bg-white rounded-xl shadow-lg">
                  <QRCodeSVG
                    value={window.location.href}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export { VCardComponent as VCard };