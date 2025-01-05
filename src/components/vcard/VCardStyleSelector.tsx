import { StyleOption } from './types';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface VCardStyleSelectorProps {
  selectedStyle: StyleOption;
  onStyleSelect: (style: StyleOption) => void;
  isEditing: boolean;
}

export function VCardStyleSelector({
  selectedStyle,
  onStyleSelect,
  isEditing
}: VCardStyleSelectorProps) {
  if (!isEditing) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {styleOptions.map((style) => (
        <Button
          key={style.id}
          variant={selectedStyle.id === style.id ? 'default' : 'outline'}
          className="relative px-4 py-2"
          onClick={() => onStyleSelect(style)}
        >
          {style.name}
          {selectedStyle.id === style.id && (
            <Check className="w-4 h-4 ml-2" />
          )}
        </Button>
      ))}
    </div>
  );
}

const styleOptions: StyleOption[] = [
  {
    id: 'modern',
    name: 'Moderne',
    color: '#3B82F6',
    secondaryColor: '#60A5FA',
    font: 'Inter, sans-serif',
    bgGradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
    colors: {
      primary: '#3B82F6',
      secondary: '#60A5FA',
      text: {
        primary: '#FFFFFF',
        secondary: '#E5E7EB',
        muted: '#9CA3AF'
      }
    }
  },
  {
    id: 'classic',
    name: 'Classique',
    color: '#4B5563',
    secondaryColor: '#6B7280',
    font: 'Georgia, serif',
    bgGradient: 'bg-gradient-to-br from-gray-600 to-gray-700',
    colors: {
      primary: '#4B5563',
      secondary: '#6B7280',
      text: {
        primary: '#FFFFFF',
        secondary: '#E5E7EB',
        muted: '#9CA3AF'
      }
    }
  },
  {
    id: 'creative',
    name: 'Créatif',
    color: '#EC4899',
    secondaryColor: '#F472B6',
    font: 'Poppins, sans-serif',
    bgGradient: 'bg-gradient-to-br from-pink-500 to-pink-600',
    colors: {
      primary: '#EC4899',
      secondary: '#F472B6',
      text: {
        primary: '#FFFFFF',
        secondary: '#E5E7EB',
        muted: '#9CA3AF'
      }
    }
  }
];

export { styleOptions };