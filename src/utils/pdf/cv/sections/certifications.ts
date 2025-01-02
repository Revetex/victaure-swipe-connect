import { pdfStyles } from '../styles';
import type { ExtendedJsPDF } from '../../types';
import type { Certification } from '@/types/profile';

export const renderCertifications = (
  doc: ExtendedJsPDF,
  certifications: Certification[] | undefined,
  yPos: number,
  styles: typeof pdfStyles
): number => {
  let currentY = yPos;

  if (!certifications || certifications.length === 0) {
    return currentY;
  }

  currentY += 10;
  doc.setFontSize(styles.fonts.subheader.size);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Certifications', styles.margins.left, currentY);
  currentY += 8;

  certifications.forEach(cert => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(cert.title, styles.margins.left, currentY);
    currentY += 6;

    doc.setFontSize(styles.fonts.body.size);
    doc.setFont('helvetica', 'normal');
    doc.text(cert.institution, styles.margins.left, currentY);
    currentY += 6;

    if (cert.year) {
      doc.setTextColor(128, 128, 128);
      doc.text(cert.year, styles.margins.left, currentY);
      currentY += 6;
    }

    if (cert.description) {
      doc.setTextColor(51, 51, 51);
      const descLines = doc.splitTextToSize(cert.description, 165);
      doc.text(descLines, styles.margins.left, currentY);
      currentY += (descLines.length * 5) + 4;
    }

    currentY += 4; // Add some space between certification entries
  });

  return currentY;
};