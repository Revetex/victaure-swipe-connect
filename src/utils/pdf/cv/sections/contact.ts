import type { ExtendedJsPDF } from '../../types';
import type { UserProfile } from '@/types/profile';
import { pdfStyles } from '../styles';
import { Mail, Phone, MapPin } from 'lucide-react';

export const renderContact = (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  startY: number
): number => {
  const { margins, fonts, colors } = pdfStyles;
  let currentY = startY + 10;

  // Section title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(fonts.subheader.size);
  doc.setTextColor(colors.text.primary);
  doc.text('Contact', margins.left, currentY);
  currentY += 12;

  // Contact details with better spacing and icons
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fonts.body.size);
  doc.setTextColor(colors.text.secondary);

  const contactInfo = [
    { label: 'Email:', value: profile.email, icon: '✉' },
    { label: 'Téléphone:', value: profile.phone, icon: '📱' },
    { label: 'Localisation:', value: `${profile.city || ''}, ${profile.state || ''}, ${profile.country || ''}`, icon: '📍' }
  ];

  contactInfo.forEach(({ label, value, icon }) => {
    if (value && value.trim()) {
      // Icon
      doc.setFont('helvetica', 'normal');
      doc.text(icon, margins.left, currentY);
      
      // Label and value
      doc.setFont('helvetica', 'bold');
      doc.text(label, margins.left + 10, currentY);
      
      const labelWidth = doc.getTextWidth(label);
      doc.setFont('helvetica', 'normal');
      doc.text(value.trim(), margins.left + labelWidth + 15, currentY);
      
      currentY += 8;
    }
  });

  return currentY + 5;
};