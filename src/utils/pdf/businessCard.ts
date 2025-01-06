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
  doc.setFillColor(selectedStyle.color);
  doc.rect(0, 0, 85.6, 53.98, 'F');

  try {
    // Add name and role with centered positioning
    doc.setTextColor(255, 255, 255);
    doc.setFont(selectedStyle.font || 'helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(profile.full_name || '', 10, 15);
    
    doc.setFont(selectedStyle.font || 'helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(profile.role || '', 10, 22);

    // Add contact details with adjusted positioning
    doc.setFontSize(9);
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

    // Add QR code on the right side
    try {
      const qrCodeUrl = await QRCode.toDataURL(window.location.href);
      doc.addImage(qrCodeUrl, 'PNG', 65, 15, 15, 15);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }

  } catch (error) {
    console.error('Error generating business card:', error);
  }

  return doc;
};