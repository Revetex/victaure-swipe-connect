import { ExtendedJsPDF } from '../../types';
import { UserProfile } from '@/types/profile';
import { pdfStyles } from '../styles';

export const renderHeader = async (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  startY: number
): Promise<number> => {
  let currentY = startY;

  // Clean header background
  doc.setFillColor(250, 250, 252);
  doc.rect(0, 0, doc.internal.pageSize.width, 45, 'F');

  // Name with profile style
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(profile.full_name || '', 20, currentY + 5);
  currentY += 12;

  // Role with profile style
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(profile.role || '', 20, currentY + 5);
  currentY += 8;

  // Company if available
  if (profile.company_name) {
    doc.setFontSize(14);
    doc.setTextColor(100, 116, 139);
    doc.text(profile.company_name, 20, currentY + 5);
    currentY += 10;
  }

  // Subtle separator line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(20, currentY + 8, doc.internal.pageSize.width - 20, currentY + 8);

  return currentY + 15;
};