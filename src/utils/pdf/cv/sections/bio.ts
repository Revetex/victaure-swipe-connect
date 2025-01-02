import { ExtendedJsPDF } from '../types';
import { UserProfile } from '@/types/profile';
import { pdfStyles } from '../styles';
import { drawSection } from '../../helpers';

export const renderBio = (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  yPos: number,
  accentColor: string
): number => {
  let currentY = yPos;

  if (profile.bio) {
    currentY += 10;
    drawSection(doc, currentY, 180, 30, accentColor);

    doc.setFontSize(pdfStyles.fonts.subheader.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(pdfStyles.colors.text.primary);
    doc.text('À propos', pdfStyles.margins.left, currentY);
    
    currentY += 8;
    doc.setFontSize(pdfStyles.fonts.body.size);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(pdfStyles.colors.text.secondary);
    const bioLines = doc.splitTextToSize(profile.bio, 170);
    doc.text(bioLines, pdfStyles.margins.left, currentY);
    currentY += (bioLines.length * 5) + 15;
  }

  return currentY;
};