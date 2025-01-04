import type { jsPDF } from 'jspdf';

export interface ExtendedJsPDF extends jsPDF {
  roundedRect: (x: number, y: number, w: number, h: number, rx: number, ry: number, style: string) => void;
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