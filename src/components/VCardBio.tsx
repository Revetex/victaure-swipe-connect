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
      className="space-y-4 p-6 rounded-xl bg-card/20 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-foreground">Présentation</h3>
        {isEditing && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleGenerateBio}
            disabled={isGenerating}
            className="bg-primary/10 hover:bg-primary/20 border-primary/20"
          >
            {isGenerating ? (
              <Loader className="mr-2 h-4 w-4" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Générer
          </Button>
        )}
      </div>

      {isEditing ? (
        <textarea
          value={profile?.bio || ""}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          placeholder="Écrivez une courte présentation..."
          className="w-full min-h-[150px] p-4 rounded-lg bg-card/10 border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-ring"
        />
      ) : profile?.bio ? (
        <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
      ) : null}
    </motion.div>
  );
}