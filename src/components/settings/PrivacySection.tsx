
import { Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function PrivacySection() {
  const [privacyEnabled, setPrivacyEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

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
        console.error('Auth error:', authError);
        throw authError;
      }

      if (!user) return;

      const newPrivacyState = !privacyEnabled;

      const { error } = await supabase
        .from('profiles')
        .update({ 
          privacy_enabled: newPrivacyState,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setPrivacyEnabled(newPrivacyState);
    } catch (error) {
      console.error('Error updating privacy settings:', error);
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
          {privacyEnabled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span className="text-sm">Profil privé</span>
        </div>
        <Switch 
          checked={privacyEnabled}
          onCheckedChange={handlePrivacyToggle}
          disabled={isLoading}
        />
      </div>
    </Button>
  );
}
