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
        toast.error("Erreur d'authentification");
        return;
      }

      if (!session) {
        toast.error("Veuillez vous connecter pour générer une bio");
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error("User verification error:", userError);
        toast.error("Erreur de vérification utilisateur");
        return;
      }

      const bioContext = {
        skills: profile.skills || [],
        experiences: (profile.experiences || []).map((exp: any) => ({
          position: exp.position,
          company: exp.company,
          description: exp.description,
          start_date: exp.start_date,
          end_date: exp.end_date
        })),
        education: (profile.education || []).map((edu: any) => ({
          degree: edu.degree,
          field_of_study: edu.field_of_study,
          school_name: edu.school_name
        })),
        certifications: (profile.certifications || []).map((cert: any) => ({
          title: cert.title,
          issuer: cert.issuer
        }))
      };

      console.log("Generating bio with context:", bioContext);

      const { data, error } = await supabase.functions.invoke('generate-bio', {
        body: bioContext
      });

      if (error) {
        console.error("Error from generate-bio function:", error);
        throw new Error("Erreur lors de la génération de la bio");
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
      className="space-y-4 p-4 sm:p-6 rounded-xl bg-white/5 dark:bg-black/20 backdrop-blur-sm border border-gray-200/10 dark:border-white/5"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white/90">Présentation</h3>
        {isEditing && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleGenerateBio}
            disabled={isGenerating}
            className="bg-white/5 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-white/10 border-gray-200/20 dark:border-white/10 text-gray-700 dark:text-white/90"
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
          className="w-full min-h-[120px] p-3 rounded-lg bg-white/5 dark:bg-black/20 border border-gray-200/20 dark:border-white/10 text-sm sm:text-base text-gray-900 dark:text-white/90 placeholder:text-gray-500/50 dark:placeholder:text-white/30 focus:ring-1 focus:ring-primary/20 dark:focus:ring-white/20 focus:border-primary/30 dark:focus:border-white/30"
        />
      ) : profile?.bio ? (
        <p className="text-sm sm:text-base text-gray-700 dark:text-white/80 leading-relaxed">{profile.bio}</p>
      ) : null}
    </motion.div>
  );
}