import type jsPDF from 'jspdf';

export interface ExtendedJsPDF extends jsPDF {
  splitTextToSize: (text: string, maxWidth: number) => string[];
  setGlobalAlpha: (alpha: number) => void;
  setFillColor: (color: string | number, g?: number, b?: number) => jsPDF;
  setDrawColor: (color: string | number, g?: number, b?: number) => jsPDF;
  setLineWidth: (width: number) => jsPDF;
  line: (x1: number, y1: number, x2: number, y2: number) => jsPDF;
  rect: (x: number, y: number, w: number, h: number, style: string) => jsPDF;
  roundedRect: (x: number, y: number, w: number, h: number, rx: number, ry: number, style: string) => jsPDF;
  circle: (x: number, y: number, r: number, style: string) => jsPDF;
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