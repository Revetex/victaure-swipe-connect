import type { ExtendedJsPDF } from '../../types';
import type { UserProfile } from '@/types/profile';
import { pdfStyles } from '../styles';

export const renderHeader = async (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  startY: number
): Promise<number> => {
  const { margins, fonts, colors } = pdfStyles;
  
  // Set font for name
  doc.setFont('helvetica', fonts.header.style);
  doc.setFontSize(fonts.header.size);
  doc.setTextColor(colors.text.primary);

  // Draw name
  const name = profile.full_name || 'No Name';
  doc.text(name, margins.left, startY + 10);
  
  // Set font for role
  doc.setFont('helvetica', fonts.subheader.style);
  doc.setFontSize(fonts.subheader.size);
  doc.setTextColor(colors.text.secondary);

  // Draw role
  const role = profile.role || 'No Role';
  doc.text(role, margins.left, startY + 20);

  return startY + 30;
};