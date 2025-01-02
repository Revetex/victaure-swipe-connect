import type { ExtendedJsPDF } from '../../types';
import type { UserProfile } from '@/types/profile';
import { pdfStyles } from '../styles';

export const renderHeader = async (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  startY: number
): Promise<number> => {
  const { margins, fonts, colors } = pdfStyles;
  
  // Set font for header
  doc.setFont('helvetica', fonts.header.style);
  doc.setFontSize(fonts.header.size);
  doc.setTextColor(colors.primary);

  // Draw name
  doc.text(profile.full_name || 'No Name', margins.left, startY);
  
  // Set font for role
  doc.setFont('helvetica', fonts.subheader.style);
  doc.setFontSize(fonts.subheader.size);
  doc.setTextColor(colors.text.secondary);

  // Draw role
  const roleY = startY + 10;
  doc.text(profile.role || 'No Role', margins.left, roleY);

  return roleY + 10; // Return next Y position
};