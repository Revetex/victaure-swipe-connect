import { createContext, useContext, useState, ReactNode } from 'react';

export interface StyleOption {
  id: string;
  name: string;
  color: string;
  secondaryColor: string;
  font: string;
  bgGradient: string;
  colors: {
    primary: string;
    secondary: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    background: {
      card: string;
      section: string;
      button: string;
    }
  };
}

const defaultStyle: StyleOption = {
  id: 'victaure',
  name: 'Victaure',
  color: '#9333EA',
  secondaryColor: '#A855F7',
  font: 'Inter, sans-serif',
  bgGradient: 'bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200',
  colors: {
    primary: '#9333EA',
    secondary: '#A855F7',
    text: {
      primary: '#1F2937',
      secondary: '#4B5563',
      muted: '#6B7280',
    },
    background: {
      card: '#FFFFFF',
      section: '#F9FAFB',
      button: '#9333EA'
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

  return (
    <VCardStyleContext.Provider value={{ selectedStyle, setSelectedStyle }}>
      {children}
    </VCardStyleContext.Provider>
  );
}

export const useVCardStyle = () => useContext(VCardStyleContext);

export default VCardStyleContext;