import { ExtendedJsPDF } from '../types';
import { UserProfile } from '@/types/profile';
import { pdfStyles } from '../styles';
import { loadImage } from '../utils';
import { drawHeader } from '../../helpers';

export const renderHeader = async (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  yPos: number,
  accentColor: string = '#1E40AF'
): Promise<number> => {
  // Add header with custom color
  const headerHeight = 50;
  drawHeader(doc, headerHeight, accentColor, accentColor + '80');

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