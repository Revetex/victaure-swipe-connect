
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfilePreviewBioProps {
  profile: UserProfile;
}

export function ProfilePreviewBio({ profile }: ProfilePreviewBioProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(profile.bio || "");
  const isOwnProfile = user?.id === profile.id;

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
        <h3 className="text-lg font-medium">Bio</h3>
        {isOwnProfile && !isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Modifier
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Écrivez quelque chose à propos de vous..."
            className="min-h-[120px] resize-none"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setBio(profile.bio || "");
                setIsEditing(false);
              }}
            >
              Annuler
            </Button>
            <Button onClick={handleSave}>
              Enregistrer
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground leading-relaxed">
          {profile.bio}
        </p>
      )}
    </motion.div>
  );
}
