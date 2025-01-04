import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { extendPdfDocument } from "./pdfExtensions";
import { StyleOption } from "@/components/vcard/types";
import QRCode from "qrcode";

export const generateBusinessCard = async (
  profile: UserProfile,
  selectedStyle: StyleOption
): Promise<ExtendedJsPDF> => {
  const doc = extendPdfDocument(new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85.6, 53.98]
  }));

  // Set background color based on style
  doc.setFillColor(selectedStyle.colors.primary);
  doc.rect(0, 0, 85.6, 53.98, 'F');

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
      
      // Position photo on the left side with better spacing
      const imgSize = 15;
      const imgX = 5;
      const imgY = (53.98 - imgSize) / 2;
      doc.addImage(img, 'JPEG', imgX, imgY, imgSize, imgSize, undefined, 'MEDIUM');
    } catch (error) {
      console.error('Error loading profile image:', error);
    }
  }

  // Set text color to white for better contrast
  doc.setTextColor(255, 255, 255);

  // Add name and role with better spacing
  const textStartX = profile.avatar_url ? 25 : 5;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(profile.full_name || '', textStartX, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(profile.role || '', textStartX, 26);

  // Add contact details with better layout
  doc.setFontSize(9);
  let contactY = 32;
  
  if (profile.email) {
    doc.text(profile.email, textStartX, contactY);
    contactY += 5;
  }
  
  if (profile.phone) {
    doc.text(profile.phone, textStartX, contactY);
    contactY += 5;
  }
  
  if (profile.city) {
    doc.text(profile.city, textStartX, contactY);
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