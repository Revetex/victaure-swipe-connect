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
    // Add profile photo on the left if available (smaller and round)
    if (profile.avatar_url) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = profile.avatar_url;
      });
      
      // Create circular clip for the image
      doc.setDrawColor(255, 255, 255);
      doc.setFillColor(255, 255, 255);
      doc.circle(15, 15, 8, 'F'); // Smaller circle for the photo
      doc.addImage(img, 'JPEG', 7, 7, 16, 16); // Smaller image size
    }

    // Add name and role with more space for content
    doc.setTextColor(255, 255, 255);
    doc.setFont(selectedStyle.font || 'helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(profile.full_name || '', 30, 15);
    
    doc.setFont(selectedStyle.font || 'helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(profile.role || '', 30, 22);

    // Add contact details
    doc.setFontSize(9);
    let contactY = 32;
    
    if (profile.email) {
      doc.text(profile.email, 30, contactY);
      contactY += 5;
    }
    
    if (profile.phone) {
      doc.text(profile.phone, 30, contactY);
      contactY += 5;
    }
    
    if (profile.city) {
      doc.text([profile.city, profile.state, profile.country].filter(Boolean).join(', '), 30, contactY);
    }

    // Add QR code
    try {
      const qrCodeUrl = await QRCode.toDataURL(window.location.href);
      doc.addImage(qrCodeUrl, 'PNG', 65, 35, 15, 15);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }

  } catch (error) {
    console.error('Error generating business card:', error);
  }

  return doc;
};