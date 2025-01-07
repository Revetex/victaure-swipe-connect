export interface StyleOption {
  id: string;
  name: string;
  color: string;
  secondaryColor: string;
  font: string;
  bgGradient: string;
  borderStyle: string;
  colors: {
    text: {
      primary: string;
      secondary: string;
    };
  };
}