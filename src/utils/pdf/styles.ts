import type { PDFStyles } from './types';

export const pdfStyles: PDFStyles = {
  colors: {
    primary: '#1E293B',
    secondary: '#475569',
    background: '#FFFFFF',
    text: {
      primary: '#1A1F2C',
      secondary: '#475569',
      muted: '#94A3B8'
    },
    accent: '#E2E8F0'
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
      size: 11,
      style: 'normal'
    }
  }
};