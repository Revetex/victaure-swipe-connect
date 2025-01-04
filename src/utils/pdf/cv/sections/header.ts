import type { ExtendedJsPDF } from '../../types';
import type { UserProfile } from '@/types/profile';
import { pdfStyles } from '../styles';

export const renderHeader = async (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  startY: number
): Promise<number> => {
  const { margins, fonts, colors } = pdfStyles;
  
  // Add a subtle accent background for the header using hex opacity
  doc.setFillColor(colors.accent + '1A'); // 10% opacity
  doc.rect(margins.left, startY - 5, 180, 25, 'F');

  // Set font for name
  doc.setFont('helvetica', fonts.header.style);
  doc.setFontSize(fonts.header.size);
  doc.setTextColor(colors.text.primary);

  // Draw name with a subtle shadow effect using hex opacity
  doc.setTextColor('#00000019'); // 10% opacity black
  doc.text(profile.full_name || 'No Name', margins.left + 0.5, startY + 0.5);
  doc.setTextColor(colors.text.primary);
  doc.text(profile.full_name || 'No Name', margins.left, startY);
  
  // Set font for role
  doc.setFont('helvetica', fonts.subheader.style);
  doc.setFontSize(fonts.subheader.size);
  doc.setTextColor(colors.text.secondary);

  // Draw role
  const roleY = startY + 10;
  doc.text(profile.role || 'No Role', margins.left, roleY);

  return roleY + 15;
};