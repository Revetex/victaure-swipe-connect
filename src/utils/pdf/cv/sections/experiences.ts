import { pdfStyles } from '../styles';
import type { ExtendedJsPDF } from '../../types';
import type { Experience } from '@/types/profile';
import { drawTimelineDot, drawTimeline } from '../../helpers';

export const renderExperiences = (
  doc: ExtendedJsPDF,
  experiences: Experience[] | undefined,
  yPos: number,
  styles: typeof pdfStyles
): number => {
  let currentY = yPos;

  if (!experiences || experiences.length === 0) {
    return currentY;
  }

  currentY += 10;
  doc.setFontSize(styles.fonts.subheader.size);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Expérience professionnelle', styles.margins.left, currentY);
  currentY += 8;

  experiences.forEach((exp, index) => {
    drawTimelineDot(doc, styles.margins.left - 2, currentY - 2, styles.colors.primary);
    
    if (index < experiences.length - 1) {
      drawTimeline(doc, currentY, currentY + 20, styles.margins.left - 2, styles.colors.primary);
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${exp.position} - ${exp.company}`, styles.margins.left + 2, currentY);
    currentY += 6;

    if (exp.start_date) {
      doc.setFontSize(styles.fonts.body.size);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(128, 128, 128);
      const dateText = exp.end_date 
        ? `${new Date(exp.start_date).toLocaleDateString('fr-FR')} - ${new Date(exp.end_date).toLocaleDateString('fr-FR')}`
        : `${new Date(exp.start_date).toLocaleDateString('fr-FR')} - Présent`;
      doc.text(dateText, styles.margins.left + 2, currentY);
      currentY += 6;
    }

    if (exp.description) {
      doc.setTextColor(51, 51, 51);
      const descLines = doc.splitTextToSize(exp.description, 165);
      doc.text(descLines, styles.margins.left + 2, currentY);
      currentY += (descLines.length * 5) + 10;
    }

    currentY += 4; // Add some space between experience entries
  });

  return currentY;
};