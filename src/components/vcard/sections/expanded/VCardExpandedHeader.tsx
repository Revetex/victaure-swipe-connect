import { VCardAvatar } from "../header/VCardAvatar";
import { VCardMainInfo } from "../header/VCardMainInfo";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Edit, Save } from "lucide-react";

interface VCardExpandedHeaderProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
  setIsEditing: (isEditing: boolean) => void;
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
}

export function VCardExpandedHeader({
  profile,
  isEditing,
  setProfile,
  setIsEditing,
  isExpanded,
  setIsExpanded
}: VCardExpandedHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-4 flex-1">
        <VCardAvatar profile={profile} isEditing={isEditing} setProfile={setProfile} />
        <VCardMainInfo profile={profile} isEditing={isEditing} setProfile={setProfile} />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(!isEditing)}
          className="shrink-0"
        >
          {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="shrink-0"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}