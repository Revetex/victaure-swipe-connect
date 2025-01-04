import { jsPDF } from 'jspdf';

export interface ExtendedJsPDF extends jsPDF {
  setGlobalAlpha: (alpha: number) => void;
}