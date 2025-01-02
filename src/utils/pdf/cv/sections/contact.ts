import type { ExtendedJsPDF } from '../../types';
import type { UserProfile } from '@/types/profile';
import { pdfStyles } from '../styles';

export const renderContact = (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  startY: number
): number => {
  const { margins, fonts, colors } = pdfStyles;

  // Set font for contact section
  doc.setFont('helvetica', fonts.body.style);
  doc.setFontSize(fonts.body.size);
  doc.setTextColor(colors.text.primary);

  const contactInfo = [
    { label: 'Email:', value: profile.email },
    { label: 'Phone:', value: profile.phone },
    { label: 'Location:', value: `${profile.city || ''}, ${profile.state || ''}, ${profile.country || ''}` }
  ];

  let currentY = startY;
  const lineHeight = 7;

  contactInfo.forEach(({ label, value }) => {
    if (value) {
      doc.setFont('helvetica', 'bold');
      doc.text(label, margins.left, currentY);
      
      const labelWidth = doc.getTextWidth(label);
      doc.setFont('helvetica', 'normal');
      doc.text(value, margins.left + labelWidth + 5, currentY);
      
      currentY += lineHeight;
    }
  });

  return currentY + 5;
};