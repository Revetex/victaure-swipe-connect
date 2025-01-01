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
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";

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
      <Card className="border-none shadow-lg bg-gradient-to-br from-indigo-600 to-indigo-800">
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

            <div className="flex justify-center pt-4 border-t border-white/20">
              <Button
                onClick={handleEditRequest}
                className="bg-white hover:bg-white/90 text-indigo-600 transition-colors"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Modifier mon profil avec M. Victaure
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export { VCardComponent as VCard };