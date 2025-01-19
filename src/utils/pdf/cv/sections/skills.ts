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
    // Section title with profile style
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, currentY, doc.internal.pageSize.width - 30, 8, 3, 3, 'F');
    
    currentY += 6;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Compétences', 20, currentY);
    currentY += 12;

    // Skills with profile-like styling
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

      if (xOffset + bubbleWidth > maxWidth) {
        xOffset = 20;
        currentY += bubbleHeight + 8;
      }

      // Profile-like skill bubble
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(xOffset, currentY - bubbleHeight + 2, bubbleWidth, bubbleHeight + 2, cornerRadius, cornerRadius, 'F');

      // Skill text
      doc.setTextColor(51, 65, 85);
      doc.text(skill, xOffset + bubblePadding, currentY);

      xOffset += bubbleWidth + bubbleSpacing;
    });

    currentY += 20;
  }

  return currentY;
};