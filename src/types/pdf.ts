import { jsPDF } from 'jspdf';

export interface ExtendedJsPDF extends jsPDF {
  setGlobalAlpha: (alpha: number) => void;
  roundedRect: (x: number, y: number, w: number, h: number, rx: number, ry: number, style: string) => void;
  addSpace: (space: number) => number;
}