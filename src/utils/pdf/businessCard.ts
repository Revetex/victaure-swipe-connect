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

  // Set background with style-specific gradient
  doc.setFillColor(selectedStyle.colors.primary);
  doc.setDrawColor(selectedStyle.colors.secondary);
  
  // Apply gradient background using rect with opacity
  doc.setGlobalAlpha(0.1);
  doc.rect(0, 0, 85.6, 53.98, 'F');
  doc.setGlobalAlpha(1);

  try {
    // Add name and role with styled positioning
    doc.setTextColor(selectedStyle.colors.text.primary);
    doc.setFont(selectedStyle.font.split(",")[0].replace(/['"]+/g, ''), 'bold');
    doc.setFontSize(14);
    doc.text(profile.full_name || '', 10, 15);
    
    doc.setFont(selectedStyle.font.split(",")[0].replace(/['"]+/g, ''), 'normal');
    doc.setFontSize(12);
    doc.setTextColor(selectedStyle.colors.text.secondary);
    doc.text(profile.role || '', 10, 22);

    // Add contact details with styling
    doc.setFontSize(9);
    doc.setTextColor(selectedStyle.colors.text.muted);
    let contactY = 32;
    
    if (profile.email) {
      doc.text(profile.email, 10, contactY);
      contactY += 5;
    }
    
    if (profile.phone) {
      doc.text(profile.phone, 10, contactY);
      contactY += 5;
    }
    
    if (profile.city) {
      doc.text([profile.city, profile.state, profile.country].filter(Boolean).join(', '), 10, contactY);
    }

    // Add QR code with style-matched frame
    try {
      const qrCodeUrl = await QRCode.toDataURL(window.location.href);
      doc.setDrawColor(selectedStyle.colors.primary);
      doc.setLineWidth(0.5);
      doc.roundedRect(63, 13, 19, 19, 2, 2, 'S');
      doc.addImage(qrCodeUrl, 'PNG', 65, 15, 15, 15);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }

  } catch (error) {
    console.error('Error generating business card:', error);
  }

  return doc;
};