import { ExtendedJsPDF } from '../../types';
import { UserProfile } from '@/types/profile';
import { pdfStyles } from '../styles';

export const renderHeader = (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  yPos: number = pdfStyles.margins.top
): number => {
  let currentY = yPos;

  // Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(pdfStyles.fonts.header.size);
  doc.setTextColor(pdfStyles.colors.primary);
  doc.text(profile.full_name || 'Non défini', pdfStyles.margins.left, currentY);
  currentY += 10;

  // Role
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(pdfStyles.fonts.subheader.size);
  doc.setTextColor(pdfStyles.colors.secondary);
  doc.text(profile.role || 'Non défini', pdfStyles.margins.left, currentY);
  currentY += 15;

  // Contact info with improved spacing and styling
  doc.setFontSize(pdfStyles.fonts.body.size);
  doc.setTextColor(pdfStyles.colors.text.secondary);

  if (profile.email) {
    doc.text(`Email: ${profile.email}`, pdfStyles.margins.left, currentY);
    currentY += 6;
  }

  if (profile.phone) {
    doc.text(`Téléphone: ${profile.phone}`, pdfStyles.margins.left, currentY);
    currentY += 6;
  }

  if (profile.city || profile.state) {
    doc.text(
      `Localisation: ${[profile.city, profile.state].filter(Boolean).join(', ')}`,
      pdfStyles.margins.left,
      currentY
    );
    currentY += 10;
  }

  // Add a subtle separator line
  doc.setDrawColor(pdfStyles.colors.accent);
  doc.setLineWidth(0.5);
  doc.line(pdfStyles.margins.left, currentY, 190, currentY);
  currentY += 10;

  return currentY;
};