export interface StyleOption {
  id: string;
  name: string;
  description: string;
  fontFamily: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  layout: 'classic' | 'modern' | 'minimal';
}