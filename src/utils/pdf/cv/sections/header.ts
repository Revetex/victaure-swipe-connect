import { ExtendedJsPDF } from "@/types/pdf";
import { UserProfile } from "@/types/profile";
import QRCode from "qrcode";

export const renderHeader = async (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  startY: number,
  styles: any
): Promise<number> => {
  const { margins, fonts, colors } = styles;
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
      doc.addImage(img, 'JPEG', margins.left, currentY, 30, 30, undefined, 'MEDIUM');
      currentY += 35;
    } catch (error) {
      console.error('Error loading profile image:', error);
    }
  }
  
  // Set font for name
  doc.setFont(fonts.family || 'helvetica', fonts.header.style);
  doc.setFontSize(fonts.header.size);
  doc.setTextColor(colors.text.primary);

  // Draw name
  const name = profile.full_name || 'No Name';
  doc.text(name, margins.left, currentY);
  currentY += 10;
  
  // Set font for role
  doc.setFont(fonts.family || 'helvetica', fonts.subheader.style);
  doc.setFontSize(fonts.subheader.size);
  doc.setTextColor(colors.text.secondary);

  // Draw role
  const role = profile.role || 'No Role';
  doc.text(role, margins.left, currentY);
  currentY += 10;

  // Add QR code
  try {
    const qrCodeUrl = await QRCode.toDataURL(window.location.href);
    doc.addImage(qrCodeUrl, 'PNG', doc.internal.pageSize.width - 40, startY, 30, 30);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  return currentY + 10;
};