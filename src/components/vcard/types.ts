export interface StyleOption {
  id: string;
  name: string;
  color: string;
  secondaryColor: string;
  font: string;
  bgGradient: string;
  borderStyle?: string;
  displayStyle?: string;
  accentGradient?: string;
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
    };
  }
}