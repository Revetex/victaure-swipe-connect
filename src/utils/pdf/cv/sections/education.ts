import { ExtendedJsPDF } from '../../types';
import { UserProfile } from '@/types/profile';
import { pdfStyles } from '../styles';

export const renderEducation = (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  yPos: number
): number => {
  let currentY = yPos;

  if (profile.education && profile.education.length > 0) {
    currentY += 10;
    doc.setFontSize(pdfStyles.fonts.subheader.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(pdfStyles.colors.text.primary);
    doc.text('Formation', pdfStyles.margins.left, currentY);
    currentY += 10;

    profile.education.forEach(edu => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${edu.degree}${edu.field_of_study ? ` - ${edu.field_of_study}` : ''}`, pdfStyles.margins.left, currentY);
      currentY += 6;
      
      doc.setFontSize(pdfStyles.fonts.body.size);
      doc.setFont('helvetica', 'normal');
      doc.text(edu.school_name, pdfStyles.margins.left, currentY);
      currentY += 6;

      if (edu.start_date) {
        doc.setTextColor(pdfStyles.colors.text.muted);
        const dateText = edu.end_date 
          ? `${new Date(edu.start_date).toLocaleDateString('fr-FR')} - ${new Date(edu.end_date).toLocaleDateString('fr-FR')}`
          : `${new Date(edu.start_date).toLocaleDateString('fr-FR')} - Présent`;
        doc.text(dateText, pdfStyles.margins.left, currentY);
        currentY += 6;
      }

      if (edu.description) {
        doc.setTextColor(pdfStyles.colors.text.secondary);
        const descLines = doc.splitTextToSize(edu.description, 165);
        doc.text(descLines, pdfStyles.margins.left, currentY);
        currentY += (descLines.length * 5) + 8;
      }
    });
  }

  return currentY;
}