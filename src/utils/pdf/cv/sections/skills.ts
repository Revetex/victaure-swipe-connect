import { ExtendedJsPDF } from '../../types';
import { UserProfile } from '@/types/profile';
import { pdfStyles } from '../styles';

export const renderSkills = (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  yPos: number
): number => {
  let currentY = yPos + 10;
  const { margins, fonts, colors } = pdfStyles;

  if (profile.skills && profile.skills.length > 0) {
    // Section title
    doc.setFontSize(fonts.subheader.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.text.primary);
    doc.text('Compétences', margins.left, currentY);
    currentY += 12;

    // Create skill bubbles
    doc.setFontSize(fonts.body.size);
    doc.setFont('helvetica', 'normal');
    
    let xOffset = margins.left;
    const maxWidth = doc.internal.pageSize.width - (margins.left + margins.right);
    const bubblePadding = 10;
    const bubbleSpacing = 5;

    profile.skills.forEach((skill) => {
      // Calculate bubble width
      doc.setFont('helvetica', 'normal');
      const textWidth = doc.getTextWidth(skill);
      const bubbleWidth = textWidth + (bubblePadding * 2);

      // Check if we need to move to next line
      if (xOffset + bubbleWidth > maxWidth) {
        xOffset = margins.left;
        currentY += 15;
      }

      // Draw bubble background
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(xOffset, currentY - 5, bubbleWidth, 10, 5, 5, 'F');

      // Draw skill text
      doc.setTextColor(colors.text.primary);
      doc.text(skill, xOffset + bubblePadding, currentY);

      xOffset += bubbleWidth + bubbleSpacing;
    });

    currentY += 20;
  }

  return currentY;
};