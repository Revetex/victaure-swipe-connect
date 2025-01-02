import { pdfStyles } from '../styles';
import type { ExtendedJsPDF } from '../../types';
import type { UserProfile } from '@/types/profile';
import { loadImage } from '../utils';

export const renderHeader = async (
  doc: ExtendedJsPDF, 
  profile: UserProfile, 
  yPos: number
): Promise<number> => {
  let currentY = yPos;

  // Add profile picture if available
  if (profile.avatar_url) {
    try {
      const img = await loadImage(profile.avatar_url);
      const imgSize = 30;
      doc.addImage(
        img,
        'JPEG',
        pdfStyles.margins.left,
        currentY - 10,
        imgSize,
        imgSize,
        undefined,
        'MEDIUM'
      );
      // Adjust text position when image is present
      currentY += 5;
    } catch (error) {
      console.error('Error loading profile picture:', error);
    }
  }

  // Header with name and role
  doc.setTextColor(pdfStyles.colors.background);
  doc.setFontSize(pdfStyles.fonts.header.size);
  doc.setFont('helvetica', pdfStyles.fonts.header.style);
  doc.text(profile.full_name || '', profile.avatar_url ? pdfStyles.margins.left + 35 : pdfStyles.margins.left, currentY);

  currentY += 10;
  doc.setFontSize(pdfStyles.fonts.subheader.size);
  doc.setFont('helvetica', pdfStyles.fonts.subheader.style);
  if (profile.role) {
    doc.text(profile.role, profile.avatar_url ? pdfStyles.margins.left + 35 : pdfStyles.margins.left, currentY);
    currentY += 10;
  }

  return currentY;
};