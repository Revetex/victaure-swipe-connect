import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { StyleOption } from "@/components/vcard/types";
import QRCode from "qrcode";

export const generateBusinessCard = async (
  profile: UserProfile,
  selectedStyle: StyleOption
): Promise<ExtendedJsPDF> => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85.6, 53.98]
  }) as ExtendedJsPDF;

  // Set background color based on style
  doc.setFillColor(selectedStyle.colors.primary);
  doc.rect(0, 0, 85.6, 53.98, 'F');

  // Add profile photo if available at the top
  if (profile.avatar_url) {
    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = profile.avatar_url;
      });
      
      const imgSize = 15;
      const imgX = (85.6 - imgSize) / 2;
      const imgY = 5;
      doc.addImage(img, 'JPEG', imgX, imgY, imgSize, imgSize, undefined, 'MEDIUM');
    } catch (error) {
      console.error('Error loading profile image:', error);
    }
  }

  // Set text color to white for better contrast
  doc.setTextColor(255, 255, 255);

  // Add name and role centered at the top
  const nameY = profile.avatar_url ? 25 : 15;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(profile.full_name || '', 85.6/2, nameY, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(profile.role || '', 85.6/2, nameY + 6, { align: 'center' });

  // Add contact details at the bottom
  doc.setFontSize(9);
  let contactY = 38;
  
  if (profile.email) {
    doc.text(profile.email, 85.6/2, contactY, { align: 'center' });
    contactY += 5;
  }
  
  if (profile.phone) {
    doc.text(profile.phone, 85.6/2, contactY, { align: 'center' });
    contactY += 5;
  }
  
  if (profile.city) {
    doc.text(profile.city, 85.6/2, contactY, { align: 'center' });
  }

  // Add QR code in bottom right corner with smaller size
  try {
    const qrCodeUrl = await QRCode.toDataURL(window.location.href);
    // Smaller QR code (10mm x 10mm) positioned in bottom right corner with 3mm margin
    doc.addImage(qrCodeUrl, 'PNG', 72.6, 41, 10, 10);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  return doc;
};