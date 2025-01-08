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
    if (!profile) return;
    
    setIsGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Pass more complete profile data for better context
      const { data, error } = await supabase.functions.invoke('generate-bio', {
        body: {
          full_name: profile.full_name,
          role: profile.role,
          skills: profile.skills || [],
          experiences: profile.experiences || [],
          education: profile.education || [],
          certifications: profile.certifications || [],
          city: profile.city,
          state: profile.state,
          country: profile.country,
          industry: profile.industry,
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
        <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
      ) : null}
    </div>
  );
}