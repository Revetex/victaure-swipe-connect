import { pdfStyles } from '../styles';
import type { ExtendedJsPDF } from '../../types';
import type { Education } from '@/types/profile';

export const renderEducation = (
  doc: ExtendedJsPDF,
  education: Education[] | undefined,
  yPos: number,
  styles: typeof pdfStyles
): number => {
  let currentY = yPos;

  if (!education || education.length === 0) {
    return currentY;
  }

  currentY += 10;
  doc.setFontSize(styles.fonts.subheader.size);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Formation', styles.margins.left, currentY);
  currentY += 10;

  education.forEach(edu => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${edu.degree}${edu.field_of_study ? ` - ${edu.field_of_study}` : ''}`, styles.margins.left, currentY);
    currentY += 6;
    
    doc.setFontSize(styles.fonts.body.size);
    doc.setFont('helvetica', 'normal');
    doc.text(edu.school_name, styles.margins.left, currentY);
    currentY += 6;

    if (edu.start_date) {
      doc.setTextColor(128, 128, 128);
      const dateText = edu.end_date 
        ? `${new Date(edu.start_date).toLocaleDateString('fr-FR')} - ${new Date(edu.end_date).toLocaleDateString('fr-FR')}`
        : `${new Date(edu.start_date).toLocaleDateString('fr-FR')} - Présent`;
      doc.text(dateText, styles.margins.left, currentY);
      currentY += 6;
    }

    if (edu.description) {
      doc.setTextColor(51, 51, 51);
      const descLines = doc.splitTextToSize(edu.description, 165);
      doc.text(descLines, styles.margins.left, currentY);
      currentY += (descLines.length * 5) + 8;
    }

    currentY += 4; // Add some space between education entries
  });

  return currentY;
};