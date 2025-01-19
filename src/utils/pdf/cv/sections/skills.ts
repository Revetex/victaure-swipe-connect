import { ExtendedJsPDF } from '../../types';
import { UserProfile } from '@/types/profile';
import { pdfStyles } from '../styles';

export const renderSkills = (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  yPos: number
): number => {
  let currentY = yPos + 10;

  if (profile.skills && profile.skills.length > 0) {
    // Section title with styling
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(15, currentY, doc.internal.pageSize.width - 30, 6, 2, 2, 'F');
    
    currentY += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text('Compétences', 20, currentY);
    currentY += 12;

    // Create modern skill bubbles
    doc.setFontSize(10);
    
    let xOffset = 20;
    const maxWidth = doc.internal.pageSize.width - 40;
    const bubblePadding = 8;
    const bubbleSpacing = 6;
    const bubbleHeight = 8;
    const cornerRadius = 4;

    profile.skills.forEach((skill) => {
      doc.setFont('helvetica', 'normal');
      const textWidth = doc.getTextWidth(skill);
      const bubbleWidth = textWidth + (bubblePadding * 2);

      // Check if we need to move to next line
      if (xOffset + bubbleWidth > maxWidth) {
        xOffset = 20;
        currentY += bubbleHeight + 8;
      }

      // Draw bubble background with rounded corners
      doc.setFillColor(230, 230, 230);
      doc.roundedRect(xOffset, currentY - bubbleHeight + 2, bubbleWidth, bubbleHeight + 2, cornerRadius, cornerRadius, 'F');

      // Draw skill text
      doc.setTextColor(60, 60, 60);
      doc.text(skill, xOffset + bubblePadding, currentY);

      xOffset += bubbleWidth + bubbleSpacing;
    });

    currentY += 20;
  }

  return currentY;
};