export const pdfStyles = {
  colors: {
    primary: '#2D3748',
    secondary: '#4A5568',
    accent: '#E2E8F0',
    background: '#FFFFFF',
    text: {
      primary: '#1A202C',
      secondary: '#4A5568',
      muted: '#718096'
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
      size: 11,
      style: 'normal'
    }
  },
  spacing: {
    section: 20,
    paragraph: 10,
    line: 6
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
    fonts: pdfStyles.fonts,
    spacing: pdfStyles.spacing
  };
};