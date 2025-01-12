import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "@/components/ui/loader";
import { useVCardStyle } from "./vcard/VCardStyleContext";

interface VCardBioProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
}

export function VCardBio({ profile, isEditing, setProfile }: VCardBioProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { selectedStyle } = useVCardStyle();

  const handleGenerateBio = async () => {
    if (!profile) {
      toast.error("Profil non disponible");
      return;
    }
    
    setIsGenerating(true);

    const attemptGeneration = async (attempt: number): Promise<void> => {
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
          
          // Check if we should retry
          if (attempt < 3 && (error.message?.includes('Failed to fetch') || error.status === 503)) {
            console.log(`Retry attempt ${attempt + 1} of 3`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return attemptGeneration(attempt + 1);
          }
          
          throw error;
        }

        if (!data?.bio) {
          throw new Error("Aucune bio générée");
        }
        
        setProfile({ ...profile, bio: data.bio });
        toast.success("Bio générée avec succès");
      } catch (error: any) {
        console.error("Error generating bio:", error);
        
        // If we haven't exceeded max retries and it's a network error, retry
        if (attempt < 3 && (error.message?.includes('Failed to fetch') || error.status === 503)) {
          console.log(`Retry attempt ${attempt + 1} of 3`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          return attemptGeneration(attempt + 1);
        }
        
        toast.error(error.message || "Erreur lors de la génération de la bio");
      }
    };

    try {
      await attemptGeneration(0);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
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
            onClick={handleGenerateBio}
            disabled={isGenerating}
            style={{ 
              borderColor: selectedStyle.colors.primary,
              color: selectedStyle.colors.primary 
            }}
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
          className="w-full min-h-[100px] p-2 rounded-md bg-background"
          style={{ 
            color: selectedStyle.colors.text.primary,
            borderColor: `${selectedStyle.colors.primary}30`
          }}
        />
      ) : profile?.bio ? (
        <p style={{ color: selectedStyle.colors.text.secondary }}>
          {profile.bio}
        </p>
      ) : null}
    </div>
  );
}