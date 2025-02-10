
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Save } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProfilePreviewBioProps {
  profile: UserProfile;
}

export function ProfilePreviewBio({ profile }: ProfilePreviewBioProps) {
  const { profile: currentProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(profile.bio || "");
  const isOwnProfile = currentProfile?.id === profile.id;

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ bio })
        .eq('id', profile.id);

      if (error) throw error;

      setIsEditing(false);
      toast.success("Bio mise à jour avec succès");
    } catch (error) {
      console.error('Error updating bio:', error);
      toast.error("Erreur lors de la mise à jour de la bio");
    }
  };

  if (!profile.bio && !isOwnProfile) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">À propos</h3>
        {isOwnProfile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="h-8"
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4 mr-2" />
                Modifier
              </>
            )}
          </Button>
        )}
      </div>

      <Card className="p-4">
        {isEditing ? (
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Parlez-nous de vous..."
            className="min-h-[100px]"
          />
        ) : (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {profile.bio || (isOwnProfile && "Ajoutez une bio pour vous présenter...")}
          </p>
        )}
      </Card>
    </motion.div>
  );
}
