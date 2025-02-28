
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { StyleOption } from './types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const styles: StyleOption[] = [
  {
    id: 'modern',
    name: 'Modern',
    color: '#047857',
    secondaryColor: '#10B981',
    font: 'Inter, sans-serif',
    bgGradient: 'bg-gradient-to-br from-emerald-50 via-teal-100 to-emerald-200',
    colors: {
      primary: '#065F46',
      secondary: '#10B981',
      text: {
        primary: '#064E3B',
        secondary: '#065F46',
        muted: '#047857',
      },
      background: {
        card: '#FFFFFF',
        section: '#F9FAFB',
        button: '#065F46'
      }
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    color: '#1E293B',
    secondaryColor: '#64748B',
    font: 'system-ui, sans-serif',
    bgGradient: 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200',
    colors: {
      primary: '#1E293B',
      secondary: '#64748B',
      text: {
        primary: '#0F172A',
        secondary: '#1E293B',
        muted: '#475569',
      },
      background: {
        card: '#FFFFFF',
        section: '#F8FAFC',
        button: '#1E293B'
      }
    },
  },
  {
    id: 'violet',
    name: 'Violet',
    color: '#7E22CE',
    secondaryColor: '#A855F7',
    font: 'Poppins, sans-serif',
    bgGradient: 'bg-gradient-to-br from-purple-50 via-purple-100 to-fuchsia-200',
    colors: {
      primary: '#7E22CE',
      secondary: '#A855F7',
      text: {
        primary: '#581C87',
        secondary: '#7E22CE',
        muted: '#9333EA',
      },
      background: {
        card: '#FFFFFF',
        section: '#FAF5FF',
        button: '#7E22CE'
      }
    },
  },
];

const defaultStyle: StyleOption = styles[0];

const VCardStyleContext = createContext<{
  selectedStyle: StyleOption;
  setSelectedStyle: (style: StyleOption) => Promise<void>;
  styles: StyleOption[];
}>({
  selectedStyle: defaultStyle,
  setSelectedStyle: async () => {},
  styles: styles,
});

export function VCardStyleProvider({ children }: { children: ReactNode }) {
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(defaultStyle);
  const [isUpdating, setIsUpdating] = useState(false);

  // Charger le style initial
  useEffect(() => {
    const loadProfileStyle = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('style_id')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading style:', error);
          return;
        }

        if (data?.style_id) {
          const style = styles.find(s => s.id === data.style_id);
          if (style) {
            setSelectedStyle(style);
          }
        }
      } catch (error) {
        console.error('Error in loadProfileStyle:', error);
      }
    };

    loadProfileStyle();
  }, []);

  // Gérer le changement de style de manière asynchrone
  const handleStyleChange = async (style: StyleOption): Promise<void> => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Vous devez être connecté pour changer le style");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ style_id: style.id })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating style:', error);
        throw error;
      }

      setSelectedStyle(style);
      toast.success("Style mis à jour avec succès");
      
    } catch (error) {
      console.error('Error updating style:', error);
      toast.error("Erreur lors de la mise à jour du style");
    } finally {
      setIsUpdating(false);
    }
  };

  // Mettre à jour les variables CSS lors du changement de style
  useEffect(() => {
    const root = document.documentElement;
    const variables = {
      '--primary-color': selectedStyle.colors.primary,
      '--secondary-color': selectedStyle.colors.secondary,
      '--text-primary': selectedStyle.colors.text.primary,
      '--text-secondary': selectedStyle.colors.text.secondary,
      '--bg-card': selectedStyle.colors.background.card,
      '--bg-section': selectedStyle.colors.background.section,
      '--font-family': selectedStyle.font,
    };

    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [selectedStyle]);

  return (
    <VCardStyleContext.Provider value={{ 
      selectedStyle, 
      setSelectedStyle: handleStyleChange,
      styles 
    }}>
      {children}
    </VCardStyleContext.Provider>
  );
}

export const useVCardStyle = () => useContext(VCardStyleContext);

export default VCardStyleContext;
