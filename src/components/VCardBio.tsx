import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "@/components/ui/loader";
import { motion } from "framer-motion";

interface VCardBioProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
}

export function VCardBio({ profile, isEditing, setProfile }: VCardBioProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateBio = async () => {
    if (!profile) {
      toast.error("Profil non disponible");
      return;
    }
    
    setIsGenerating(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        toast.error("Erreur d'authentification. Veuillez vous reconnecter.");
        return;
      }

      if (!session) {
        toast.error("Veuillez vous connecter pour générer une bio");
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error("User verification error:", userError);
        toast.error("Erreur de vérification utilisateur. Veuillez vous reconnecter.");
        return;
      }

      console.log("Generating bio with profile data:", {
        skills: profile.skills,
        experiences: profile.experiences,
        education: profile.education,
      });

      const { data, error } = await supabase.functions.invoke('generate-bio', {
        body: {
          skills: profile.skills || [],
          experiences: profile.experiences || [],
          education: profile.education || [],
        }
      });

      if (error) {
        console.error("Error from generate-bio function:", error);
        throw new Error(error.message || "Erreur lors de la génération de la bio");
      }

      if (!data?.bio) {
        throw new Error("Aucune bio générée");
      }
      
      setProfile({ ...profile, bio: data.bio });
      toast.success("Bio générée avec succès");
    } catch (error: any) {
      console.error("Error generating bio:", error);
      toast.error(error.message || "Erreur lors de la génération de la bio");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 p-4 sm:p-6 rounded-xl bg-card/10 backdrop-blur-sm border border-border/5"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-primary/90">Présentation</h3>
        {isEditing && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleGenerateBio}
            disabled={isGenerating}
            className="bg-primary/5 hover:bg-primary/10 border-primary/10"
          >
            {isGenerating ? (
              <Loader className="mr-2 h-3 w-3" />
            ) : (
              <Wand2 className="mr-2 h-3 w-3" />
            )}
            <span className="text-xs sm:text-sm">Générer</span>
          </Button>
        )}
      </div>

      {isEditing ? (
        <textarea
          value={profile?.bio || ""}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          placeholder="Écrivez une courte présentation..."
          className="w-full min-h-[120px] p-3 rounded-lg bg-card/5 border border-border/10 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-ring focus:border-ring"
        />
      ) : profile?.bio ? (
        <p className="text-sm sm:text-base text-muted-foreground/90 leading-relaxed">{profile.bio}</p>
      ) : null}
    </motion.div>
  );
}