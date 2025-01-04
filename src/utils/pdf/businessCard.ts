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
      // Position photo on the left side
      doc.addImage(img, 'JPEG', 5, 5, 20, 20, undefined, 'MEDIUM');
    } catch (error) {
      console.error('Error loading profile image:', error);
    }
  }

  // Set text color to white for better contrast
  doc.setTextColor(255, 255, 255);

  // Add name and role with better spacing
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(profile.full_name || '', 30, 12);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(profile.role || '', 30, 20);

  // Add contact details with better layout
  doc.setFontSize(9);
  let contactY = 28;
  
  if (profile.email) {
    doc.text(profile.email, 30, contactY);
    contactY += 6;
  }
  
  if (profile.phone) {
    doc.text(profile.phone, 30, contactY);
    contactY += 6;
  }
  
  if (profile.city) {
    doc.text(profile.city, 30, contactY);
  }

  // Add QR code on the right side
  try {
    const qrCodeUrl = await QRCode.toDataURL(window.location.href);
    doc.addImage(qrCodeUrl, 'PNG', 65, 5, 15, 15);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  return doc;
};