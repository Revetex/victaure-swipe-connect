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
  // Add more styles as needed
];

const defaultStyle: StyleOption = styles[0];

const VCardStyleContext = createContext<{
  selectedStyle: StyleOption;
  setSelectedStyle: (style: StyleOption) => void;
  styles: StyleOption[];
}>({
  selectedStyle: defaultStyle,
  setSelectedStyle: () => {},
  styles: styles,
});

export function VCardStyleProvider({ children }: { children: ReactNode }) {
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(defaultStyle);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleStyleChange = async (style: StyleOption) => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Vous devez être connecté pour changer le style");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ style_id: style.id })
        .eq('id', user.id);

      if (error) throw error;

      setSelectedStyle(style);
      toast.success("Style mis à jour avec succès");
      
    } catch (error) {
      console.error('Error updating style:', error);
      toast.error("Erreur lors de la mise à jour du style");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    
    const updateRootStyles = () => {
      root.style.setProperty('--primary-color', selectedStyle.colors.primary);
      root.style.setProperty('--secondary-color', selectedStyle.colors.secondary);
      root.style.setProperty('--text-primary', selectedStyle.colors.text.primary);
      root.style.setProperty('--text-secondary', selectedStyle.colors.text.secondary);
      root.style.setProperty('--bg-card', selectedStyle.colors.background.card);
      root.style.setProperty('--bg-section', selectedStyle.colors.background.section);
      root.style.setProperty('--font-family', selectedStyle.font);
    };

    updateRootStyles();
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
