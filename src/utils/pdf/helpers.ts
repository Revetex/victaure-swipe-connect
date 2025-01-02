import type { ExtendedJsPDF } from './types';

export const drawHeader = (doc: ExtendedJsPDF, headerHeight: number, primaryColor: string, secondaryColor: string) => {
  // Add decorative header
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 210, headerHeight, 'F');

  // Add subtle pattern to header using opacity
  for (let i = 0; i < headerHeight; i += 2) {
    doc.setFillColor(secondaryColor);
    // Use a lighter color instead of opacity
    const color = secondaryColor + '1A'; // 1A = 10% opacity in hex
    doc.setFillColor(color);
    doc.rect(0, i, 210, 1, 'F');
  }
};

export const drawSection = (doc: ExtendedJsPDF, yPos: number, width: number, height: number, color: string) => {
  // Use a lighter color instead of opacity
  const backgroundColor = color + '1A'; // 1A = 10% opacity in hex
  doc.setFillColor(backgroundColor);
  doc.roundedRect(20 - 5, yPos - 5, width, height, 3, 3, 'F');
};

export const drawTimeline = (doc: ExtendedJsPDF, startY: number, endY: number, x: number, color: string) => {
  doc.setDrawColor(color);
  doc.setLineWidth(0.2);
  doc.line(x, startY, x, endY);
};

export const drawTimelineDot = (doc: ExtendedJsPDF, x: number, y: number, color: string) => {
  doc.setFillColor(color);
  doc.circle(x, y, 1, 'F');
};