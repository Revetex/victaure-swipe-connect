export const pdfStyles = {
  colors: {
    primary: '#1A1F2C',
    secondary: '#4B5563',
    accent: '#E5DEFF',
    background: '#FFFFFF',
    text: {
      primary: '#1A1F2C',
      secondary: '#4B5563',
      muted: '#8E9196'
    }
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

export const convertStyleOptionToPdfStyle = (styleOption: any) => {
  return {
    colors: {
      primary: styleOption.colors?.text?.primary || pdfStyles.colors.primary,
      secondary: styleOption.colors?.text?.secondary || pdfStyles.colors.secondary,
      background: styleOption.colors?.background?.card || pdfStyles.colors.background,
      text: {
        primary: styleOption.colors?.text?.primary || pdfStyles.colors.text.primary,
        secondary: styleOption.colors?.text?.secondary || pdfStyles.colors.text.secondary,
        muted: styleOption.colors?.text?.muted || pdfStyles.colors.text.muted
      },
      accent: styleOption.accentGradient || pdfStyles.colors.accent
    },
    margins: pdfStyles.margins,
    fonts: {
      ...pdfStyles.fonts,
      family: styleOption.font?.split(',')[0].replace(/['"]+/g, '') || 'Helvetica'
    }
  };
};