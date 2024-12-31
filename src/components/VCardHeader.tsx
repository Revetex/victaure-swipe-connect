import { Button } from "@/components/ui/button";
import { Maximize2, X, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import { VCardAvatar } from "./vcard/sections/header/VCardAvatar";
import { VCardMainInfo } from "./vcard/sections/header/VCardMainInfo";

interface VCardHeaderProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
  setIsEditing: (isEditing: boolean) => void;
  isExpanded?: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
}

export function VCardHeader({ 
  profile, 
  isEditing, 
  setProfile, 
  setIsEditing, 
  isExpanded,
  setIsExpanded 
}: VCardHeaderProps) {
  return (
    <motion.div 
      className="flex flex-col gap-3 relative w-full"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-3">
        <VCardAvatar
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />
        <VCardMainInfo
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />
      </div>
      <div className="absolute top-0 right-0 flex gap-2">
        {isExpanded && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(!isEditing)}
            className="text-muted-foreground hover:text-foreground transition-colors h-8 w-8"
          >
            {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
          </Button>
        )}
        {!isExpanded && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(true)}
            className="text-muted-foreground hover:text-foreground transition-colors h-8 w-8"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}