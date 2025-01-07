import { ExtendedJsPDF } from '../../types';
import { UserProfile } from '@/types/profile';
import { StyleOption } from '@/components/vcard/types';

export const renderHeader = async (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  startY: number,
  style?: StyleOption
): Promise<number> => {
  let currentY = startY;

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
      doc.addImage(img, 'JPEG', 20, currentY, 35, 35, undefined, 'MEDIUM');
      currentY += 40;
    } catch (error) {
      console.error('Error loading profile image:', error);
      currentY += 5;
    }
  }
  
  // Name
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(style?.colors?.text?.primary || '#000000');
  doc.text(profile.full_name || 'No Name', 20, currentY);
  currentY += 8;
  
  // Role
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(style?.colors?.text?.secondary || '#666666');
  doc.text(profile.role || 'No Role', 20, currentY);
  currentY += 10;

  return currentY;
};