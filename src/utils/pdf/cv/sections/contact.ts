import { pdfStyles } from '../styles';
import type { ExtendedJsPDF } from '../../types';
import type { UserProfile } from '@/types/profile';

export const renderContactInfo = (
  doc: ExtendedJsPDF, 
  profile: UserProfile, 
  yPos: number
): number => {
  let currentY = yPos + 10;
  
  doc.setTextColor(pdfStyles.colors.text.primary);
  doc.setFontSize(pdfStyles.fonts.body.size);
  doc.setFont('helvetica', pdfStyles.fonts.body.style);

  const contactInfo = [];
  if (profile.email) contactInfo.push(`Email: ${profile.email}`);
  if (profile.phone) contactInfo.push(`Téléphone: ${profile.phone}`);
  if (profile.city) {
    const location = [profile.city, profile.state, profile.country].filter(Boolean).join(', ');
    contactInfo.push(`Localisation: ${location}`);
  }

  contactInfo.forEach(info => {
    doc.text(info, pdfStyles.margins.left, currentY);
    currentY += 6;
  });

  return currentY;
};