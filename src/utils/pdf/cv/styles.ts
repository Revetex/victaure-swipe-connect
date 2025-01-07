import type { PDFStyles } from '../types';

export const pdfStyles: PDFStyles = {
  colors: {
    primary: '#1E40AF',
    secondary: '#60A5FA',
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
      size: 11,
      style: 'normal'
    }
  }
};

export const convertStyleOptionToPdfStyle = (styleOption: any): PDFStyles => {
  return {
    colors: {
      primary: styleOption.color || pdfStyles.colors.primary,
      secondary: styleOption.secondaryColor || pdfStyles.colors.secondary,
      background: styleOption.bgColor || pdfStyles.colors.background,
      text: {
        primary: styleOption.textColor || pdfStyles.colors.text.primary,
        secondary: styleOption.mutedColor || pdfStyles.colors.text.secondary,
        muted: styleOption.mutedColor || pdfStyles.colors.text.muted
      },
      accent: styleOption.accentColor || pdfStyles.colors.accent
    },
    margins: pdfStyles.margins,
    fonts: pdfStyles.fonts
  };
};