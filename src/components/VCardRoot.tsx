import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { VCardContent } from "./VCardContent";
import { VCardSkeleton } from "./vcard/VCardSkeleton";
import { useProfile } from "@/hooks/useProfile";
import { styleOptions } from "./vcard/styles";
import type { StyleOption } from "./vcard/types";

interface VCardProps {
  onEditStateChange: (isEditing: boolean) => void;
  onRequestChat: () => void;
}

export function VCard({ onEditStateChange, onRequestChat }: VCardProps) {
  const { profile, setProfile, isLoading } = useProfile();
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(styleOptions[0]);

  useEffect(() => {
    if (profile?.id) {
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
    }
  }, [profile?.id]);

  if (isLoading || !profile) {
    return <VCardSkeleton />;
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-600 to-indigo-900 dark:from-indigo-900 dark:to-indigo-950">
        <VCardContent 
          profile={profile}
          setProfile={setProfile}
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          onEditStateChange={onEditStateChange}
          onRequestChat={onRequestChat}
          styleOptions={styleOptions}
        />
      </Card>
    </div>
  );
}

export { VCard as VCardRoot };