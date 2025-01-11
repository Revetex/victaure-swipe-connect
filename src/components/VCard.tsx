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

      // Check authentication first
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.error('Auth error:', authError);
        toast.error("Erreur d'authentification. Veuillez vous reconnecter.");
        return;
      }

      if (!session) {
        toast.error("Veuillez vous connecter pour générer une bio");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Utilisateur non trouvé");
        return;
      }

      const response = await fetch(
        'https://mfjllillnpleasclqabb.supabase.co/functions/v1/generate-bio',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            skills: profile?.skills || [],
            experiences: profile?.experiences || [],
            education: profile?.education || []
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Bio generation error:', errorData);
        throw new Error(errorData.error || 'Erreur lors de la génération de la bio');
      }

      const { bio, error } = await response.json();
      
      if (error) {
        throw new Error(error);
      }

      if (!bio) {
        throw new Error('Aucune bio générée');
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ bio })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      setProfile(prev => prev ? { ...prev, bio } : null);
      toast.success('Bio générée avec succès !');

    } catch (error) {
      console.error('Generate bio error:', error);
      toast.error(error.message || "Erreur lors de la génération de la bio");
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
