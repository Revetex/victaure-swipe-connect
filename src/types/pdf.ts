import { jsPDF } from "jspdf";

export interface ExtendedJsPDF extends jsPDF {
  setGlobalAlpha: (alpha: number) => ExtendedJsPDF;
  roundedRect: (x: number, y: number, w: number, h: number, rx: number, ry: number, style: string) => ExtendedJsPDF;
  addSpace: (space: number) => number;
}