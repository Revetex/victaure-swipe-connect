import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useVCardStyle } from "./vcard/VCardStyleContext";

interface VCardBioProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
}

export function VCardBio({ profile, isEditing, setProfile }: VCardBioProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { selectedStyle } = useVCardStyle();

  const generateBioWithAI = async () => {
    setIsGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase.functions.invoke('generate-bio', {
        body: {
          skills: profile.skills,
          experiences: profile.experiences,
          education: profile.education,
        }
      });

      if (error) throw error;
      
      setProfile({ ...profile, bio: data.bio });
      toast.success("Bio générée avec succès");
    } catch (error) {
      console.error("Error generating bio:", error);
      toast.error("Erreur lors de la génération de la bio");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 
          className="text-lg font-semibold"
          style={{ color: selectedStyle.colors.text.primary }}
        >
          Présentation
        </h3>
        {isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={generateBioWithAI}
            disabled={isGenerating}
            style={{
              backgroundColor: selectedStyle.colors.primary,
              color: "white",
              borderColor: `${selectedStyle.colors.primary}40`
            }}
            className="hover:opacity-90"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Générer avec l'IA
          </Button>
        )}
      </div>
      {isEditing ? (
        <Textarea
          value={profile.bio || ""}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          placeholder="Décrivez-vous en quelques lignes..."
          className="min-h-[100px] bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
      ) : (
        <p 
          className="whitespace-pre-wrap"
          style={{ color: selectedStyle.colors.text.secondary }}
        >
          {profile.bio || "Aucune présentation"}
        </p>
      )}
    </motion.div>
  );
}