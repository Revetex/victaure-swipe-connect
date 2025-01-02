import { ExtendedJsPDF } from '../types';
import { UserProfile } from '@/types/profile';
import { pdfStyles } from '../styles';
import { drawSection } from '../../helpers';

export const renderSkills = (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  yPos: number
): number => {
  let currentY = yPos;

  if (profile.skills && profile.skills.length > 0) {
    doc.setFontSize(pdfStyles.fonts.subheader.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(pdfStyles.colors.text.primary);
    doc.text('Compétences', pdfStyles.margins.left, currentY);
    currentY += 8;

    doc.setFontSize(pdfStyles.fonts.body.size);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(pdfStyles.colors.text.secondary);
    
    const skillsPerRow = 3;
    const skillChunks = [];
    for (let i = 0; i < profile.skills.length; i += skillsPerRow) {
      skillChunks.push(profile.skills.slice(i, i + skillsPerRow));
    }

    skillChunks.forEach(chunk => {
      const skillsText = chunk.join(' • ');
      doc.text(skillsText, pdfStyles.margins.left, currentY);
      currentY += 6;
    });
    currentY += 10;
  }

  return currentY;
};