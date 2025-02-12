
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface CustomColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
}

interface ThemeSettings {
  id: string;
  mode: 'light' | 'dark' | 'system';
  custom_colors: CustomColors;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

interface DatabaseThemeSettings {
  id: string;
  mode: 'light' | 'dark' | 'system';
  custom_colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  user_id: string;
  created_at: string;
  updated_at: string;
}

export function useThemeSettings() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [settings, setSettings] = useState<ThemeSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchThemeSettings();
    }
  }, [user]);

  const fetchThemeSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('theme_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        const themeData = data as DatabaseThemeSettings;
        setSettings({
          id: themeData.id,
          mode: themeData.mode,
          custom_colors: themeData.custom_colors as CustomColors,
          user_id: themeData.user_id,
          created_at: themeData.created_at,
          updated_at: themeData.updated_at
        });
        setTheme(themeData.mode);
        applyCustomColors(themeData.custom_colors as CustomColors);
      }
    } catch (error) {
      console.error('Error fetching theme settings:', error);
      toast.error("Erreur lors du chargement des paramètres du thème");
    } finally {
      setLoading(false);
    }
  };

  const updateThemeSettings = async (mode: 'light' | 'dark' | 'system', colors?: CustomColors) => {
    if (!user) return;

    try {
      const updates: Partial<DatabaseThemeSettings> = {
        mode,
        user_id: user.id,
      };

      if (colors) {
        updates.custom_colors = colors;
      }

      const { error } = await supabase
        .from('theme_settings')
        .upsert(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      setTheme(mode);
      if (colors) {
        applyCustomColors(colors);
      }
      
      toast.success("Thème mis à jour avec succès");
    } catch (error) {
      console.error('Error updating theme settings:', error);
      toast.error("Erreur lors de la mise à jour du thème");
    }
  };

  const applyCustomColors = (colors: CustomColors) => {
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  };

  return {
    settings,
    loading,
    updateThemeSettings,
  };
}
