import { ExtendedJsPDF } from '../../types';
import { Certification } from '@/types/profile';

export const renderCertifications = (
  doc: ExtendedJsPDF,
  certifications: Certification[],
  yPos: number
): number => {
  let currentY = yPos;

  if (!certifications || certifications.length === 0) {
    return currentY;
  }

  currentY += 10;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Certifications', 20, currentY);
  currentY += 8;

  certifications.forEach(cert => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(cert.title, 20, currentY);
    currentY += 6;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(cert.institution, 20, currentY);
    currentY += 6;

    if (cert.year) {
      doc.setTextColor(128, 128, 128);
      doc.text(cert.year, 20, currentY);
      currentY += 6;
    }

    if (cert.description) {
      doc.setTextColor(51, 51, 51);
      const descLines = doc.splitTextToSize(cert.description, 165);
      doc.text(descLines, 20, currentY);
      currentY += (descLines.length * 5) + 4;
    }

    currentY += 4;
  });

  return currentY;
};