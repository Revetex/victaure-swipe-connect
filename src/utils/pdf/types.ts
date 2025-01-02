import { jsPDF } from 'jspdf';

export interface ExtendedJsPDF extends jsPDF {
  setGlobalAlpha?: (alpha: number) => void;
}

export interface PDFStyles {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    accent: string;
  };
  margins: {
    top: number;
    left: number;
    right: number;
  };
  fonts: {
    header: {
      size: number;
      style: string;
    };
    subheader: {
      size: number;
      style: string;
    };
    body: {
      size: number;
      style: string;
    };
  };
}