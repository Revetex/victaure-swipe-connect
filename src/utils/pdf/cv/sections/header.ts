import { ExtendedJsPDF } from '../../types';
import { UserProfile } from '@/types/profile';
import { StyleOption } from '@/components/vcard/types';
import { pdfStyles } from '../styles';

export const renderHeader = async (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  startY: number,
  style?: StyleOption
): Promise<number> => {
  let currentY = startY;
  const margin = pdfStyles.margins.left;
  
  // Add profile photo if available
  if (profile.avatar_url) {
    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = profile.avatar_url;
      });

      // Add a white background circle for the image
      doc.setFillColor(255, 255, 255);
      doc.circle(margin + 20, currentY + 20, 20, 'F');
      
      // Add the image in a circular format
      doc.addImage(img, 'JPEG', margin, currentY, 40, 40, undefined, 'MEDIUM');
      
      // Move to the right of the image for text
      currentY += 5;
    } catch (error) {
      console.error('Error loading profile image:', error);
    }
  }

  // Name
  doc.setFontSize(pdfStyles.fonts.header.size);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(pdfStyles.colors.text.primary);
  doc.text(profile.full_name || 'No Name', margin + 50, currentY + 20);
  
  // Role
  currentY += 25;
  doc.setFontSize(pdfStyles.fonts.subheader.size);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(pdfStyles.colors.text.secondary);
  doc.text(profile.role || 'No Role', margin + 50, currentY + 10);

  // Add a subtle separator line
  currentY += 25;
  doc.setDrawColor(pdfStyles.colors.text.muted);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, doc.internal.pageSize.width - margin, currentY);

  return currentY + 10;
};