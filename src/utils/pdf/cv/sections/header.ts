import { ExtendedJsPDF } from "@/types/pdf";
import { UserProfile } from "@/types/profile";
import QRCode from "qrcode";

export const renderHeader = async (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  startY: number
): Promise<number> => {
  let currentY = startY;

  // Add profile photo if available with better positioning
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
      
      // Add QR code next to the photo
      const qrCodeUrl = await QRCode.toDataURL(window.location.href);
      doc.addImage(qrCodeUrl, 'PNG', 160, currentY, 30, 30);
      
      currentY += 40;
    } catch (error) {
      console.error('Error loading profile image:', error);
    }
  }
  
  // Name with larger font size
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(profile.full_name || 'No Name', 20, currentY);
  currentY += 8;
  
  // Role with improved styling
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text(profile.role || 'No Role', 20, currentY);
  currentY += 10;

  return currentY;
};