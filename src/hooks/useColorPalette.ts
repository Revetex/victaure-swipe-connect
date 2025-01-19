import { useMemo } from 'react';

export function useColorPalette() {
  return useMemo(() => [
    { value: 'yellow', label: 'Jaune', class: 'bg-[#FEF7CD]' },
    { value: 'blue', label: 'Bleu', class: 'bg-[#D3E4FD]' },
    { value: 'green', label: 'Vert', class: 'bg-[#F2FCE2]' },
    { value: 'pink', label: 'Rose', class: 'bg-[#FFDEE2]' },
    { value: 'purple', label: 'Violet', class: 'bg-[#E5DEFF]' },
    { value: 'orange', label: 'Orange', class: 'bg-[#FEC6A1]' },
  ], []);
}