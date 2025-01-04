import type jsPDF from 'jspdf';

export interface ExtendedJsPDF extends jsPDF {
  splitTextToSize: (text: string, maxWidth: number) => string[];
  setFillColor: (color: string | number, g?: number, b?: number) => jsPDF;
  setDrawColor: (color: string | number, g?: number, b?: number) => jsPDF;
  setLineWidth: (width: number) => jsPDF;
  line: (x1: number, y1: number, x2: number, y2: number) => jsPDF;
  rect: (x: number, y: number, w: number, h: number, style: string) => jsPDF;
  roundedRect: (x: number, y: number, w: number, h: number, rx: number, ry: number, style: string) => jsPDF;
  circle: (x: number, y: number, r: number, style: string) => jsPDF;
  setLineDashPattern: (pattern: number[], phase: number) => jsPDF;
}