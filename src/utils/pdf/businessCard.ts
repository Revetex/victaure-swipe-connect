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

  try {
    // Set background with style-specific gradient
    doc.setFillColor(selectedStyle.colors.background.card);
    doc.setDrawColor(selectedStyle.colors.primary);
    
    // Apply gradient background
    doc.setGlobalAlpha(0.1);
    doc.rect(0, 0, 85.6, 53.98, 'F');
    doc.setGlobalAlpha(1);

    // Add decorative accent line
    doc.setLineWidth(0.5);
    doc.setDrawColor(selectedStyle.colors.secondary);
    doc.line(10, 12, 75.6, 12);

    // Add name with enhanced styling
    doc.setTextColor(selectedStyle.colors.text.primary);
    doc.setFont(selectedStyle.font.split(",")[0].replace(/['"]+/g, ''), 'bold');
    doc.setFontSize(16);
    doc.text(profile.full_name || '', 10, 20);
    
    // Add role with professional styling
    doc.setFont(selectedStyle.font.split(",")[0].replace(/['"]+/g, ''), 'normal');
    doc.setFontSize(12);
    doc.setTextColor(selectedStyle.colors.text.secondary);
    doc.text(profile.role || '', 10, 27);

    // Add contact details with improved layout
    doc.setFontSize(9);
    doc.setTextColor(selectedStyle.colors.text.muted);
    let contactY = 35;
    
    if (profile.email) {
      doc.text(`Email: ${profile.email}`, 10, contactY);
      contactY += 5;
    }
    
    if (profile.phone) {
      doc.text(`Tel: ${profile.phone}`, 10, contactY);
      contactY += 5;
    }
    
    if (profile.city) {
      const location = [profile.city, profile.state].filter(Boolean).join(', ');
      doc.text(location, 10, contactY);
    }

    // Generate QR code for the profile URL
    const qrCodeDataUrl = await QRCode.toDataURL(window.location.href, {
      margin: 0,
      width: 50,
      color: {
        dark: selectedStyle.colors.text.primary,
        light: '#FFFFFF',
      },
    });

    // Add QR code to the right side
    doc.addImage(
      qrCodeDataUrl,
      'PNG',
      60,
      20,
      20,
      20
    );

    // Add elegant border
    doc.setDrawColor(selectedStyle.colors.primary);
    doc.setLineWidth(0.5);
    const margin = 5;
    doc.roundedRect(margin, margin, 85.6 - 2 * margin, 53.98 - 2 * margin, 3, 3, 'S');

  } catch (error) {
    console.error('Error generating business card:', error);
  }

  return doc;
};