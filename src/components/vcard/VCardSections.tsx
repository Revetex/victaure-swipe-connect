import { UserProfile } from "@/types/profile";
import { StyleOption } from "./types";

interface VCardSectionsProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  handleRemoveSkill: (skillToRemove: string) => void;
  selectedStyle: StyleOption;
  sectionsOrder: string[];
}

export function VCardSections({
  profile,
  isEditing,
  setProfile,
  handleRemoveSkill,
  selectedStyle,
  sectionsOrder,
}: VCardSectionsProps) {
  return null;
}
