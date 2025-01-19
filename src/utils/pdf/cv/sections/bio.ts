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
    // Add section title with styling
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(15, currentY, doc.internal.pageSize.width - 30, 6, 2, 2, 'F');
    
    currentY += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text('Présentation', 20, currentY);
    currentY += 10;

    // Bio content with improved readability
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    
    const bioLines = doc.splitTextToSize(profile.bio, doc.internal.pageSize.width - 40);
    doc.text(bioLines, 20, currentY);
    currentY += (bioLines.length * 6) + 10;
  }

  return currentY;
};