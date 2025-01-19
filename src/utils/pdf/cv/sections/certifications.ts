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

  // Section title with styling
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(15, currentY, doc.internal.pageSize.width - 30, 6, 2, 2, 'F');
  
  currentY += 5;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 40, 40);
  doc.text('Certifications', 20, currentY);
  currentY += 12;

  certifications.forEach((cert, index) => {
    // Certification title with modern styling
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.text(cert.title, 20, currentY);
    currentY += 6;

    // Institution with professional formatting
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(cert.institution, 20, currentY);
    currentY += 6;

    // Year with clean formatting
    if (cert.year) {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(cert.year, 20, currentY);
      currentY += 6;
    }

    // Description with improved readability
    if (cert.description) {
      doc.setTextColor(70, 70, 70);
      const descLines = doc.splitTextToSize(cert.description, doc.internal.pageSize.width - 40);
      doc.text(descLines, 20, currentY);
      currentY += (descLines.length * 5) + 4;
    }

    // Add separator between certifications
    if (index < certifications.length - 1) {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
      doc.line(20, currentY + 4, doc.internal.pageSize.width - 20, currentY + 4);
      currentY += 12;
    }
  });

  return currentY;
};