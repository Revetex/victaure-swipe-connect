import { useMemo } from 'react';
import { ColorOption } from '@/types/todo';

export function useColorPalette() {
  const colors = useMemo<ColorOption[]>(() => [
    { value: 'yellow', label: 'Jaune', class: 'bg-yellow-100' },
    { value: 'blue', label: 'Bleu', class: 'bg-blue-100' },
    { value: 'green', label: 'Vert', class: 'bg-green-100' },
    { value: 'pink', label: 'Rose', class: 'bg-pink-100' },
    { value: 'purple', label: 'Violet', class: 'bg-purple-100' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-100' },
  ], []);

  return colors;
}