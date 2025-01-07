export const pdfStyles = {
  colors: {
    primary: '#00c896', // Emerald green
    secondary: '#808080', // Metallic gray
    accent: '#404040',
    background: '#1a1a1a',
    text: {
      primary: '#e6e6e6',
      secondary: '#b3b3b3',
      muted: '#666666'
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
      primary: styleOption.color || pdfStyles.colors.primary,
      secondary: styleOption.secondaryColor || pdfStyles.colors.secondary,
      background: styleOption.bgColor || pdfStyles.colors.background,
      text: {
        primary: styleOption.colors?.text?.primary || pdfStyles.colors.text.primary,
        secondary: styleOption.colors?.text?.secondary || pdfStyles.colors.text.secondary,
        muted: styleOption.colors?.text?.muted || pdfStyles.colors.text.muted
      },
      accent: styleOption.accentGradient || pdfStyles.colors.accent
    },
    margins: pdfStyles.margins,
    fonts: pdfStyles.fonts
  };
};