
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

interface UserSettings {
  theme: string;
  language: string;
  notifications_enabled: boolean;
  privacy_enabled: boolean;
}

interface NavigationPreferences {
  menu_order: string[];
  hidden_items: string[];
  custom_labels: Record<string, string>;
}

export const useUserSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['userSettings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profile_settings')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      // Return default settings if none exist
      return data || {
        theme: 'system',
        language: 'fr',
        notifications_enabled: true,
        privacy_enabled: false
      };
    }
  });

  const { data: navPreferences, isLoading: isLoadingNav } = useQuery({
    queryKey: ['navigationPreferences'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('navigation_preferences')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      // Parse JSON fields and return default navigation preferences if none exist
      if (data) {
        return {
          menu_order: (data.menu_order as Json[] || []).map(String),
          hidden_items: (data.hidden_items as Json[] || []).map(String),
          custom_labels: (data.custom_labels as Record<string, string>) || {}
        };
      }
      
      // Return default navigation preferences if none exist
      return {
        menu_order: [],
        hidden_items: [],
        custom_labels: {}
      };
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<UserSettings>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profile_settings')
        .upsert({ id: user.id, ...newSettings });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
      toast.success('Paramètres mis à jour');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour des paramètres');
    }
  });

  const updateNavPreferences = useMutation({
    mutationFn: async (newPrefs: Partial<NavigationPreferences>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('navigation_preferences')
        .upsert({ 
          id: user.id, 
          menu_order: JSON.stringify(newPrefs.menu_order || []),
          hidden_items: JSON.stringify(newPrefs.hidden_items || []),
          custom_labels: JSON.stringify(newPrefs.custom_labels || {})
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigationPreferences'] });
      toast.success('Préférences de navigation mises à jour');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour des préférences');
    }
  });

  return {
    settings,
    navPreferences,
    isLoading: isLoadingSettings || isLoadingNav,
    updateSettings,
    updateNavPreferences
  };
};
