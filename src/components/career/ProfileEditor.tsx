import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/profile";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileEditorProps {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
}

export function ProfileEditor({ profile, setProfile }: ProfileEditorProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleProfileUpdate = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile?.full_name,
          role: profile?.role,
          bio: profile?.bio
        })
        .eq('id', profile?.id);

      if (error) throw error;

      setIsEditing(false);
      toast({
        title: "Succès",
        description: "Vos informations ont été enregistrées avec succès",
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-200">Mon Profil</h3>
        {!isEditing ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-white"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleProfileUpdate}
              className="text-green-500 hover:text-green-400"
            >
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Nom complet</label>
          {isEditing ? (
            <Input
              value={profile?.full_name || ""}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value } as UserProfile)}
              className="bg-gray-700/50 border-gray-600"
              placeholder="Votre nom complet"
            />
          ) : (
            <p className="text-gray-200">{profile?.full_name || "Non défini"}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-1 block">Rôle</label>
          {isEditing ? (
            <Input
              value={profile?.role || ""}
              onChange={(e) => setProfile({ ...profile, role: e.target.value } as UserProfile)}
              className="bg-gray-700/50 border-gray-600"
              placeholder="Votre rôle professionnel"
            />
          ) : (
            <p className="text-gray-200">{profile?.role || "Non défini"}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-1 block">Bio</label>
          {isEditing ? (
            <Textarea
              value={profile?.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value } as UserProfile)}
              className="bg-gray-700/50 border-gray-600"
              placeholder="Décrivez votre parcours professionnel"
            />
          ) : (
            <p className="text-gray-200">{profile?.bio || "Non défini"}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}