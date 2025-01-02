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
import { Button } from "./ui/button";
import { MessageSquare, Download } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { generateVCardPDF } from "@/utils/pdfGenerator";

interface VCardProps {
  onEditStateChange?: (isEditing: boolean) => void;
  onRequestChat?: () => void;
}

export function VCardComponent({ onEditStateChange, onRequestChat }: VCardProps) {
  const { profile, isLoading } = useProfile();

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
      <Card className="border-none shadow-lg bg-victaure-metal">
        <CardContent className="p-6 space-y-8">
          <div className="flex items-start justify-between gap-4">
            <VCardHeader
              profile={profile}
              isEditing={false}
              setProfile={() => {}}
            />
            <div className="shrink-0">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <QRCodeSVG
                  value={window.location.href}
                  size={100}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>
          </div>

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
                className="bg-white hover:bg-white/90 text-victaure-metal transition-colors"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Modifier mon profil
              </Button>

              <Button
                onClick={handleDownloadPDF}
                className="bg-white hover:bg-white/90 text-victaure-metal transition-colors"
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger PDF
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export { VCardComponent as VCard };