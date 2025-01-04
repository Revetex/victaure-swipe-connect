import type { StyleOption } from "./types";

export const styleOptions: StyleOption[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Un style professionnel et intemporel',
    fontFamily: 'Playfair Display',
    colorScheme: {
      primary: 'bg-blue-600',
      secondary: 'bg-blue-200',
      accent: 'bg-yellow-400',
      background: 'bg-white',
      text: 'text-gray-900'
    },
    layout: 'classic'
  },
  {
    id: 'modern',
    name: 'Moderne',
    description: 'Un design contemporain et épuré',
    fontFamily: 'Poppins',
    colorScheme: {
      primary: 'bg-indigo-600',
      secondary: 'bg-indigo-200',
      accent: 'bg-pink-500',
      background: 'bg-gray-50',
      text: 'text-gray-800'
    },
    layout: 'modern'
  },
  {
    id: 'minimal',
    name: 'Minimaliste',
    description: 'Simple et efficace',
    fontFamily: 'Montserrat',
    colorScheme: {
      primary: 'bg-gray-900',
      secondary: 'bg-gray-200',
      accent: 'bg-gray-500',
      background: 'bg-white',
      text: 'text-gray-900'
    },
    layout: 'minimal'
  }
];