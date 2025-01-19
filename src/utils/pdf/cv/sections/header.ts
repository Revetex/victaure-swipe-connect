import { ExtendedJsPDF } from '../../types';
import { UserProfile } from '@/types/profile';
import { pdfStyles } from '../styles';

export const renderHeader = async (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  startY: number
): Promise<number> => {
  let currentY = startY;

  // Add a subtle background rectangle for the header
  doc.setFillColor(245, 245, 245);
  doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');

  // Draw a decorative line
  doc.setDrawColor(70, 70, 70);
  doc.setLineWidth(0.5);
  doc.line(20, 40, doc.internal.pageSize.width - 20, 40);

  // Name with larger font and professional styling
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 40, 40);
  doc.text(profile.full_name || '', 20, currentY + 5);
  currentY += 12;

  // Role with medium font and professional color
  doc.setFontSize(18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(profile.role || '', 20, currentY + 5);
  currentY += 8;

  // Company if available
  if (profile.company_name) {
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(profile.company_name, 20, currentY + 5);
    currentY += 10;
  }

  return currentY + 15; // Add extra padding after header
};