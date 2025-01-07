import type { ExtendedJsPDF } from '../../types';
import type { UserProfile } from '@/types/profile';
import { pdfStyles } from '../styles';

export const renderContact = (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  startY: number
): number => {
  const { margins, fonts, colors } = pdfStyles;
  let currentY = startY;

  // Set font for contact section
  doc.setFont('helvetica', fonts.body.style);
  doc.setFontSize(fonts.body.size);
  doc.setTextColor(colors.text.primary);

  // Draw section title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(fonts.subheader.size);
  doc.text('Contact', margins.left, currentY);
  currentY += 8;

  // Reset font for contact details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fonts.body.size);

  const contactInfo = [
    { label: 'Email:', value: profile.email },
    { label: 'Téléphone:', value: profile.phone },
    { label: 'Localisation:', value: `${profile.city || ''}, ${profile.state || ''}, ${profile.country || ''}` }
  ];

  contactInfo.forEach(({ label, value }) => {
    if (value && value.trim()) {
      doc.setFont('helvetica', 'bold');
      doc.text(label, margins.left, currentY);
      
      const labelWidth = doc.getTextWidth(label);
      doc.setFont('helvetica', 'normal');
      doc.text(value.trim(), margins.left + labelWidth + 5, currentY);
      
      currentY += 7;
    }
  });

  return currentY;
};