import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "@/components/ui/loader";

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
      // First check if we have an authenticated session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw new Error("Erreur d'authentification");
      }

      if (!session) {
        throw new Error("Veuillez vous connecter pour générer une bio");
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Présentation</h3>
        {isEditing && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleGenerateBio}
            disabled={isGenerating}
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
          className="w-full min-h-[100px] p-2 border rounded-md bg-background"
        />
      ) : profile?.bio ? (
        <p className="text-muted-foreground">{profile.bio}</p>
      ) : null}
    </div>
  );
}