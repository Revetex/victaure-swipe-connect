import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { StyleOption } from "@/components/vcard/types";
import QRCode from "qrcode";

export const generateBusinessCard = async (
  profile: UserProfile,
  style: StyleOption
): Promise<ExtendedJsPDF> => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85.6, 53.98]
  }) as ExtendedJsPDF;

  // Set background color based on style
  doc.setFillColor(style.colors.primary);
  doc.rect(0, 0, 85.6, 53.98, 'F');

  // Add profile photo on the left if available
  if (profile.avatar_url) {
    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = profile.avatar_url;
      });
      
      // Larger photo size and better positioning
      const imgSize = 25;
      doc.addImage(img, 'JPEG', 5, 5, imgSize, imgSize, undefined, 'MEDIUM');
    } catch (error) {
      console.error('Error loading profile image:', error);
    }
  }

  // Set text color and font from style
  doc.setTextColor(255, 255, 255);
  doc.setFont(style.font || 'helvetica');

  // Add name and role next to the photo with more spacing
  doc.setFontSize(16);
  doc.setFont(style.font || 'helvetica', 'bold');
  doc.text(profile.full_name || '', 35, 15);
  
  doc.setFontSize(12);
  doc.setFont(style.font || 'helvetica', 'normal');
  doc.text(profile.role || '', 35, 22);

  // Add Victaure logo in the middle
  try {
    const logoImg = new Image();
    logoImg.src = "/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png";
    await new Promise((resolve, reject) => {
      logoImg.onload = resolve;
      logoImg.onerror = reject;
    });
    // Center the logo
    doc.addImage(logoImg, 'PNG', 35, 25, 15, 15);
  } catch (error) {
    console.error('Error loading Victaure logo:', error);
  }

  // Add contact details at the bottom left
  doc.setFontSize(9);
  let contactY = 45;
  
  if (profile.email) {
    doc.text(profile.email, 5, contactY);
    contactY += 4;
  }
  
  if (profile.phone) {
    doc.text(profile.phone, 5, contactY);
  }

  // Add QR code in bottom right corner with smaller size
  try {
    const qrCodeUrl = await QRCode.toDataURL(window.location.href);
    doc.addImage(qrCodeUrl, 'PNG', 70, 40, 12, 12);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  return doc;
};