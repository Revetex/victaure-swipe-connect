export const pdfStyles = {
  colors: {
    primary: '#1E293B',
    secondary: '#475569',
    accent: '#F1F5F9',
    background: '#FFFFFF',
    text: {
      primary: '#0F172A',
      secondary: '#334155',
      muted: '#64748B'
    }
  },
  margins: {
    top: 25,
    left: 25,
    right: 25
  },
  fonts: {
    header: {
      size: 24,
      style: 'bold'
    },
    subheader: {
      size: 16,
      style: 'bold'
    },
    body: {
      size: 11,
      style: 'normal'
    }
  },
  spacing: {
    section: 15,
    paragraph: 8,
    line: 5
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