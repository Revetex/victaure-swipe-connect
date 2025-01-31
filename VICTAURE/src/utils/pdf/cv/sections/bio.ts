import { ExtendedJsPDF } from '../../types';
import { UserProfile } from '@/types/profile';
import { pdfStyles } from '../styles';

export const renderBio = (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  yPos: number
): number => {
  let currentY = yPos;

  if (profile.bio) {
    currentY += 10;
    doc.setFontSize(pdfStyles.fonts.subheader.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(pdfStyles.colors.text.primary);
    doc.text('Présentation', pdfStyles.margins.left, currentY);
    currentY += 8;

    doc.setFontSize(pdfStyles.fonts.body.size);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(pdfStyles.colors.text.secondary);
    
    const bioLines = doc.splitTextToSize(profile.bio, 165);
    doc.text(bioLines, pdfStyles.margins.left, currentY);
    currentY += (bioLines.length * 5) + 10;
  }

  return currentY;
}