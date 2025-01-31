import type { ExtendedJsPDF } from './types';

export const drawHeader = (doc: ExtendedJsPDF, headerHeight: number, primaryColor: string, secondaryColor: string) => {
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 210, headerHeight, 'F');

  for (let i = 0; i < headerHeight; i += 2) {
    const color = secondaryColor + '1A';
    doc.setFillColor(color);
    doc.rect(0, i, 210, 1, 'F');
  }
};

export const drawSection = (doc: ExtendedJsPDF, yPos: number, width: number, height: number, color: string) => {
  const backgroundColor = color + '1A';
  doc.setFillColor(backgroundColor);
  doc.roundedRect(20 - 5, yPos - 5, width, height, 3, 3, 'F');
};

export const formatDate = (date: string | null | undefined): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long'
  });
};