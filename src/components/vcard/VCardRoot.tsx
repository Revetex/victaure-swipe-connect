import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { VCardSkeleton } from "./VCardSkeleton";
import { VCardEmpty } from "./VCardEmpty";
import { Card } from "@/components/ui/card";
import { VCardContent } from "./VCardContent";
import { StyleOption } from "./types";
import { styleOptions } from "./styles";

interface VCardProps {
  onEditStateChange?: (isEditing: boolean) => void;
  onRequestChat?: () => void;
}

export function VCardRoot({ onEditStateChange, onRequestChat }: VCardProps) {
  const { profile, setProfile, isLoading } = useProfile();
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(styleOptions[0]);

  useEffect(() => {
    const loadFonts = async () => {
      await Promise.all([
        document.fonts.load("1em Poppins"),
        document.fonts.load("1em Montserrat"),
        document.fonts.load("1em Playfair Display"),
        document.fonts.load("1em Roboto"),
        document.fonts.load("1em Open Sans"),
      ]);
    };
    loadFonts();
  }, []);

  if (isLoading) return <VCardSkeleton />;
  if (!profile) return <VCardEmpty />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="border-none shadow-xl bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950">
        <VCardContent 
          profile={profile}
          setProfile={setProfile}
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          onEditStateChange={onEditStateChange}
          onRequestChat={onRequestChat}
        />
      </Card>
    </motion.div>
  );
}

export { VCardRoot as VCard };