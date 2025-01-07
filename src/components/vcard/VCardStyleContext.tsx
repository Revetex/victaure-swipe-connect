import { createContext, useContext } from 'react';

export interface StyleOption {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
  };
  font: string;
}

const defaultStyle: StyleOption = {
  id: 'modern',
  name: 'Modern',
  colors: {
    primary: '#3b82f6',
    secondary: '#6366f1',
    text: {
      primary: '#1f2937',
      secondary: '#4b5563',
      muted: '#9ca3af',
    },
  },
  font: 'Inter, sans-serif',
};

const VCardStyleContext = createContext<{
  selectedStyle: StyleOption;
  setSelectedStyle: (style: StyleOption) => void;
}>({
  selectedStyle: defaultStyle,
  setSelectedStyle: () => {},
});

export const useVCardStyle = () => useContext(VCardStyleContext);

export default VCardStyleContext;