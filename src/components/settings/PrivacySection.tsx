import { Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function PrivacySection() {
  const [privacyEnabled, setPrivacyEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const switchId = "privacy-toggle";
  const switchLabel = "État de la confidentialité du profil";

  useEffect(() => {
    fetchPrivacySettings();
  }, []);

  const fetchPrivacySettings = async () => {
    try {
      setIsLoading(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          setTimeout(fetchPrivacySettings, 1000 * (retryCount + 1));
          return;
        }
        throw authError;
      }

      if (!user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('privacy_enabled')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setPrivacyEnabled(profile?.privacy_enabled || false);
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
      toast.error("Erreur lors du chargement des paramètres de confidentialité");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacyToggle = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        toast.error("Erreur d'authentification");
        throw authError;
      }

      if (!user) {
        toast.error("Utilisateur non connecté");
        return;
      }

      const newPrivacyState = !privacyEnabled;

      const { error } = await supabase
        .from('profiles')
        .update({ 
          privacy_enabled: newPrivacyState,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setPrivacyEnabled(newPrivacyState);
      toast.success(newPrivacyState ? 
        "Votre profil est maintenant privé. Seuls vos amis peuvent voir votre profil complet." : 
        "Votre profil est maintenant public. Tout le monde peut voir votre profil complet."
      );
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast.error("Erreur lors de la mise à jour des paramètres de confidentialité");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-between px-2 h-9"
      onClick={handlePrivacyToggle}
      disabled={isLoading}
      asChild
    >
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          {privacyEnabled ? 
            <EyeOff className="h-4 w-4" aria-hidden="true" /> : 
            <Eye className="h-4 w-4" aria-hidden="true" />
          }
          <label htmlFor={switchId} className="text-sm">
            Profil privé
            <span className="sr-only"> - </span>
            {privacyEnabled ? 
              "Seuls vos amis peuvent voir votre profil complet" : 
              "Tout le monde peut voir votre profil complet"}
          </label>
        </div>
        <Switch 
          id={switchId}
          checked={privacyEnabled}
          onCheckedChange={handlePrivacyToggle}
          disabled={isLoading}
          aria-label={switchLabel}
          title="Activer ou désactiver le mode privé"
        />
      </div>
    </Button>
  );
}
