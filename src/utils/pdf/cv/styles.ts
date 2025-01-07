import type { PDFStyles } from '../types';

export const pdfStyles: PDFStyles = {
  colors: {
    primary: '#1A1F2C',
    secondary: '#4B5563',
    background: '#FFFFFF',
    text: {
      primary: '#1A1F2C',
      secondary: '#4B5563',
      muted: '#8E9196'
    },
    accent: '#E5DEFF'
  },
  margins: {
    top: 25,
    left: 25,
    right: 25
  },
  fonts: {
    header: {
      size: 28,
      style: 'bold'
    },
    subheader: {
      size: 18,
      style: 'bold'
    },
    body: {
      size: 12,
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