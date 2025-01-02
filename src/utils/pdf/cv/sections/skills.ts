import { pdfStyles } from '../styles';
import type { ExtendedJsPDF } from '../../types';

export const renderSkills = (
  doc: ExtendedJsPDF,
  skills: string[] | null | undefined,
  yPos: number,
  styles: typeof pdfStyles
): number => {
  let currentY = yPos;

  if (!skills || skills.length === 0) {
    return currentY;
  }

  currentY += 10;
  doc.setFontSize(styles.fonts.subheader.size);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Compétences', styles.margins.left, currentY);
  currentY += 8;

  doc.setFontSize(styles.fonts.body.size);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 51, 51);
  
  const skillsPerRow = 3;
  const skillChunks = [];
  for (let i = 0; i < skills.length; i += skillsPerRow) {
    skillChunks.push(skills.slice(i, i + skillsPerRow));
  }

  skillChunks.forEach(chunk => {
    const skillsText = chunk.join(' • ');
    doc.text(skillsText, styles.margins.left, currentY);
    currentY += 6;
  });

  return currentY + 6;
};