import type { PDFStyles } from '../types';

export const pdfStyles: PDFStyles = {
  colors: {
    primary: '#9b87f5',
    secondary: '#7E69AB',
    background: '#FFFFFF',
    text: {
      primary: '#1A1F2C',
      secondary: '#555555',
      muted: '#8E9196'
    },
    accent: '#E5DEFF'
  },
  margins: {
    top: 20,
    left: 20,
    right: 20
  },
  fonts: {
    header: {
      size: 24,
      style: 'bold'
    },
    subheader: {
      size: 16,
      style: 'normal'
    },
    body: {
      size: 10,
      style: 'normal'
    }
  }
};