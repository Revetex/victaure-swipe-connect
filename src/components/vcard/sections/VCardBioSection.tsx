
import { useState } from 'react';
import { UserProfile } from "@/types/profile";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface VCardBioSectionProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardBioSection({ profile, isEditing, setProfile }: VCardBioSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateBio = async () => {
    setIsGenerating(true);
    try {
      // Simuler une génération d'IA (à remplacer par une vraie intégration d'IA)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Exemple de bio générée basée sur le profil
      const generatedBio = `Professionnel expérimenté en ${profile.skills?.slice(0, 3).join(', ') || 'diverses compétences'}. 
      ${profile.education?.length ? `Formé en ${profile.education[0].field_of_study || profile.education[0].degree} à ${profile.education[0].school_name}.` : ''}
      ${profile.experiences?.length ? `Expert avec une expérience significative chez ${profile.experiences[0].company} en tant que ${profile.experiences[0].position}.` : ''}
      Basé à ${[profile.city, profile.state, profile.country].filter(Boolean).join(', ') || 'diverses régions'}.`;
      
      setProfile({ ...profile, bio: generatedBio.trim() });
      toast.success("Biographie générée avec succès!");
    } catch (error) {
      console.error("Error generating bio:", error);
      toast.error("Erreur lors de la génération de la biographie");
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-white/5 dark:bg-black/10 backdrop-blur-sm border border-white/10"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary/80" />
          <h3 className="font-medium text-foreground/90">Bio</h3>
        </div>
        
        {isEditing && (
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-8 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
            onClick={generateBio}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                Génération...
              </>
            ) : (
              <>
                <Sparkles className="mr-1 h-3 w-3" />
                Générer
              </>
            )}
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <Textarea
          value={profile.bio || ''}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          placeholder="Décrivez votre parcours professionnel, vos intérêts et objectifs..."
          className="min-h-[120px] bg-white/5 border-white/10 focus:ring-primary/30"
        />
      ) : (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {profile.bio ? (
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
              {profile.bio}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Aucune biographie ajoutée
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}
