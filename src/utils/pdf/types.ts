import type jsPDF from 'jspdf';

export interface ExtendedJsPDF extends jsPDF {
  splitTextToSize: (text: string, maxWidth: number) => string[];
}