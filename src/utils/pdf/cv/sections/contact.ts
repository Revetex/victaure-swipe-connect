import { ExtendedJsPDF } from '../../types';
import { UserProfile } from '@/types/profile';
import { pdfStyles } from '../styles';

export const renderContact = (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  startY: number
): number => {
  let currentY = startY;
  const { margins, fonts, colors } = pdfStyles;

  // Contact details in a clean, organized layout
  doc.setFontSize(fonts.body.size);
  doc.setTextColor(colors.text.secondary);

  const contactInfo = [
    { icon: '✉', label: 'Email:', value: profile.email },
    { icon: '📱', label: 'Téléphone:', value: profile.phone },
    { icon: '📍', label: 'Localisation:', value: `${profile.city || ''}, ${profile.state || ''}, ${profile.country || ''}` }
  ];

  // Calculate positions for a 3-column layout
  const columnWidth = (doc.internal.pageSize.width - 40) / 3;
  
  contactInfo.forEach(({ icon, label, value }, index) => {
    if (value && value.trim()) {
      const x = 20 + (index * columnWidth);
      
      // Icon
      doc.setFont('helvetica', 'normal');
      doc.text(icon, x, currentY);
      
      // Label
      doc.setFont('helvetica', 'bold');
      doc.text(label, x + 6, currentY);
      
      // Value
      doc.setFont('helvetica', 'normal');
      const labelWidth = doc.getTextWidth(label);
      doc.text(value.trim(), x + labelWidth + 8, currentY);
    }
  });

  return currentY + 8;
};