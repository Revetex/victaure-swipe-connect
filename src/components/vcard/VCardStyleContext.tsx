
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { StyleOption } from './types';

const defaultStyle: StyleOption = {
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
};

const VCardStyleContext = createContext<{
  selectedStyle: StyleOption;
  setSelectedStyle: (style: StyleOption) => void;
}>({
  selectedStyle: defaultStyle,
  setSelectedStyle: () => {},
});

export function VCardStyleProvider({ children }: { children: ReactNode }) {
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(defaultStyle);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', selectedStyle.color);
    document.documentElement.style.setProperty('--secondary-color', selectedStyle.secondaryColor);
    document.documentElement.style.fontFamily = selectedStyle.font;
  }, [selectedStyle]);

  return (
    <VCardStyleContext.Provider value={{ selectedStyle, setSelectedStyle }}>
      {children}
    </VCardStyleContext.Provider>
  );
}

export const useVCardStyle = () => useContext(VCardStyleContext);

export default VCardStyleContext;
