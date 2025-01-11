import { useState, useCallback } from "react";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Loader } from "./ui/loader";

export function VCard({ onEditStateChange, onRequestChat }: { 
  onEditStateChange: (state: boolean) => void;
  onRequestChat: () => void;
}) {
  const { profile, setProfile } = useProfile();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateBio = useCallback(async () => {
    try {
      setIsGenerating(true);
      console.log("Starting bio generation...");

      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.error('Auth error:', authError);
        toast.error("Erreur d'authentification. Veuillez vous reconnecter.");
        return;
      }

      if (!session) {
        console.log("No session found");
        toast.error("Veuillez vous connecter pour générer une bio");
        return;
      }

      console.log("Session found, calling generate-bio function...");

      const { data, error } = await supabase.functions.invoke('generate-bio', {
        body: {
          skills: profile?.skills || [],
          experiences: profile?.experiences || [],
          education: profile?.education || []
        }
      });

      console.log("Response from generate-bio:", { data, error });

      if (error) {
        throw error;
      }

      if (!data?.bio) {
        throw new Error("Aucune bio générée");
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ bio: data.bio })
        .eq('id', session.user.id);

      if (updateError) {
        throw updateError;
      }

      setProfile(prev => prev ? { ...prev, bio: data.bio } : null);
      toast.success('Bio générée avec succès !');

    } catch (error) {
      console.error('Generate bio error:', error);
      toast.error("Erreur lors de la génération de la bio");
    } finally {
      setIsGenerating(false);
    }
  }, [profile, setProfile]);

  return (
    <div className="space-y-4">
      <Button 
        onClick={generateBio} 
        disabled={isGenerating}
        className="w-full"
      >
        {isGenerating ? (
          <div className="flex items-center gap-2">
            <Loader className="w-4 h-4" />
            <span>Génération en cours...</span>
          </div>
        ) : (
          'Générer une bio'
        )}
      </Button>
      
      <div className="border p-4 rounded-lg">
        <h2 className="text-lg font-semibold">Votre Bio</h2>
        <p>{profile?.bio || "Aucune bio disponible."}</p>
      </div>

      <Button onClick={() => onEditStateChange(true)} className="w-full">
        Modifier
      </Button>
      <Button onClick={onRequestChat} className="w-full">
        Demander un chat
      </Button>
    </div>
  );
}