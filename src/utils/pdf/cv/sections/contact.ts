import { ExtendedJsPDF } from '../../types';
import { UserProfile } from '@/types/profile';
import { pdfStyles } from '../styles';

export const renderContact = (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  startY: number
): number => {
  let currentY = startY;

  // Add a subtle container for contact info
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(15, currentY - 5, doc.internal.pageSize.width - 30, 30, 3, 3, 'F');

  // Contact details in a clean, organized layout
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);

  const contactInfo = [
    { icon: '📧', label: 'Email:', value: profile.email },
    { icon: '📱', label: 'Téléphone:', value: profile.phone },
    { icon: '📍', label: 'Localisation:', value: `${profile.city || ''}, ${profile.state || ''}, ${profile.country || ''}` },
    { icon: '🌐', label: 'Site web:', value: profile.website }
  ].filter(item => item.value);

  // Calculate positions for a balanced layout
  const columnWidth = (doc.internal.pageSize.width - 40) / Math.min(contactInfo.length, 3);
  
  contactInfo.forEach(({ icon, label, value }, index) => {
    if (value && value.trim()) {
      const x = 20 + (index % 3 * columnWidth);
      const y = currentY + Math.floor(index / 3) * 12;
      
      // Icon with some styling
      doc.setFont('helvetica', 'normal');
      doc.text(icon, x, y);
      
      // Label in bold
      doc.setFont('helvetica', 'bold');
      doc.text(label, x + 8, y);
      
      // Value in normal weight
      doc.setFont('helvetica', 'normal');
      const labelWidth = doc.getTextWidth(label);
      doc.text(value.trim(), x + labelWidth + 10, y);
    }
  });

  return currentY + (Math.ceil(contactInfo.length / 3) * 12) + 8;
};