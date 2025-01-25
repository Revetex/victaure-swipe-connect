import { ExtendedJsPDF } from '../../types';
import { UserProfile } from '@/types/profile';
import { pdfStyles } from '../styles';

export const renderExperiences = (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  yPos: number
): number => {
  let currentY = yPos;

  if (profile.experiences && profile.experiences.length > 0) {
    doc.setFontSize(pdfStyles.fonts.subheader.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(pdfStyles.colors.text.primary);
    doc.text('Expérience professionnelle', pdfStyles.margins.left, currentY);
    currentY += 8;

    profile.experiences.forEach((exp) => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${exp.position} - ${exp.company}`, pdfStyles.margins.left, currentY);
      currentY += 6;

      if (exp.start_date) {
        doc.setFontSize(pdfStyles.fonts.body.size);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(pdfStyles.colors.text.muted);
        const dateText = exp.end_date 
          ? `${new Date(exp.start_date).toLocaleDateString('fr-FR')} - ${new Date(exp.end_date).toLocaleDateString('fr-FR')}`
          : `${new Date(exp.start_date).toLocaleDateString('fr-FR')} - Présent`;
        doc.text(dateText, pdfStyles.margins.left, currentY);
        currentY += 6;
      }

      if (exp.description) {
        doc.setTextColor(pdfStyles.colors.text.secondary);
        const descLines = doc.splitTextToSize(exp.description, 165);
        doc.text(descLines, pdfStyles.margins.left, currentY);
        currentY += (descLines.length * 5) + 10;
      }
    });
  }

  return currentY;
}