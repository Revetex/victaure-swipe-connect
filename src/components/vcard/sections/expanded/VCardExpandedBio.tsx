import { FileText } from "lucide-react";
import { VCardSection } from "../../VCardSection";
import { Textarea } from "@/components/ui/textarea";

interface VCardExpandedBioProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
}

export function VCardExpandedBio({ profile, isEditing, setProfile }: VCardExpandedBioProps) {
  const handleBioChange = (value: string) => {
    setProfile((prev: any) => ({ ...prev, bio: value }));
  };

  return (
    <VCardSection 
      title="Description" 
      icon={<FileText className="h-5 w-5 text-muted-foreground" />}
    >
      {isEditing ? (
        <Textarea
          value={profile.bio || ""}
          onChange={(e) => handleBioChange(e.target.value)}
          placeholder="Décrivez votre parcours professionnel..."
          className="min-h-[150px] bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <p className="text-gray-300">
          {profile.bio || "Aucune description disponible"}
        </p>
      )}
    </VCardSection>
  );
}