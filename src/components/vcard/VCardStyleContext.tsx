import { createContext, useContext } from 'react';
import { StyleOption } from './types';

interface VCardStyleContextType {
  selectedStyle: StyleOption;
  isEditing: boolean;
}

export const VCardStyleContext = createContext<VCardStyleContextType | undefined>(undefined);

export function useVCardStyle() {
  const context = useContext(VCardStyleContext);
  if (!context) {
    throw new Error('useVCardStyle must be used within a VCardStyleProvider');
  }
  return context;
}