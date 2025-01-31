import { createContext, useContext, ReactNode, useState } from 'react';
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

interface VCardStyleContextType {
  selectedStyle: StyleOption;
  setSelectedStyle: (style: StyleOption) => void;
}

const VCardStyleContext = createContext<VCardStyleContextType>({
  selectedStyle: defaultStyle,
  setSelectedStyle: () => {},
});

export function VCardStyleProvider({ children }: { children: ReactNode }) {
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(defaultStyle);

  return (
    <VCardStyleContext.Provider value={{ selectedStyle, setSelectedStyle }}>
      {children}
    </VCardStyleContext.Provider>
  );
}

export const useVCardStyle = () => useContext(VCardStyleContext);

export default VCardStyleContext;