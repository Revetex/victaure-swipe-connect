import { createContext, useContext } from "react";
import { StyleOption } from "./types";

interface VCardStyleContextType {
  selectedStyle: StyleOption;
  isEditing: boolean;
}

export const VCardStyleContext = createContext<VCardStyleContextType>({
  selectedStyle: {} as StyleOption,
  isEditing: false,
});

export const useVCardStyle = () => useContext(VCardStyleContext);