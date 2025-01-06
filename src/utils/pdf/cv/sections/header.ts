import { ExtendedJsPDF } from "@/types/pdf";
import { UserProfile } from "@/types/profile";
import { StyleOption } from "@/components/vcard/types";

export const renderHeader = async (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  startY: number,
  style: StyleOption
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
      currentY += 5; // Add some spacing even if image fails to load
    }
  }
  
  // Name with style-based formatting
  doc.setFontSize(24);
  doc.setFont(style.font, 'bold');
  doc.setTextColor(style.colors.text.primary);
  doc.text(profile.full_name || 'No Name', 20, currentY);
  currentY += 8;
  
  // Role with style-based formatting
  doc.setFontSize(16);
  doc.setFont(style.font, 'normal');
  doc.setTextColor(style.colors.text.secondary);
  doc.text(profile.role || 'No Role', 20, currentY);
  currentY += 10;

  return currentY;
};