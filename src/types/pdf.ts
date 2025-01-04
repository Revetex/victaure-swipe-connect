import { jsPDF } from 'jspdf';

export interface ExtendedJsPDF extends Omit<jsPDF, 'roundedRect'> {
  setGlobalAlpha: (alpha: number) => void;
  roundedRect: (x: number, y: number, w: number, h: number, rx: number, ry: number, style: string) => void;
}