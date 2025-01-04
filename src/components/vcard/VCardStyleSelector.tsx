import { useState } from "react";
import { StyleOption } from "./types";
import { styleOptions } from "./styles";
import { VCardStyleSelectorMinimal } from "./VCardStyleSelectorMinimal";

interface VCardStyleSelectorProps {
  selectedStyle: StyleOption;
  onStyleSelect: (style: StyleOption) => void;
  isEditing: boolean;
}

export function VCardStyleSelector({ selectedStyle, onStyleSelect, isEditing }: VCardStyleSelectorProps) {
  if (!isEditing) return null;
  
  return (
    <VCardStyleSelectorMinimal
      selectedStyle={selectedStyle}
      onStyleSelect={onStyleSelect}
      styleOptions={styleOptions}
    />
  );
}