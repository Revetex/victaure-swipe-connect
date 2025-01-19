import { ExtendedJsPDF } from '../../types';
import { UserProfile } from '@/types/profile';

export const renderHeader = async (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  startY: number
): Promise<number> => {
  let currentY = startY;

  // Name with larger font and bold style
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(profile.full_name || '', 20, currentY);
  currentY += 10;

  // Role with medium font and professional color
  doc.setFontSize(18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(profile.role || '', 20, currentY);
  currentY += 8;

  // Company if available
  if (profile.company_name) {
    doc.setFontSize(14);
    doc.text(profile.company_name, 20, currentY);
    currentY += 6;
  }

  return currentY;
};