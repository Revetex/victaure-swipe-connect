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

  // Front side
  try {
    // Set background with style-specific gradient
    doc.setFillColor(selectedStyle.colors.primary);
    doc.setDrawColor(selectedStyle.colors.secondary);
    
    // Apply gradient background using rect with opacity
    doc.setGlobalAlpha(0.1);
    doc.rect(0, 0, 85.6, 53.98, 'F');
    doc.setGlobalAlpha(1);

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

    // Add QR code with style-matched frame - Adjusted positioning and size
    try {
      const qrCodeUrl = await QRCode.toDataURL(window.location.href, {
        margin: 0,
        width: 200,
        errorCorrectionLevel: 'H'
      });
      doc.setDrawColor(selectedStyle.colors.primary);
      doc.setLineWidth(0.5);
      // Adjusted QR code position and size
      const qrSize = 20;
      const qrX = 85.6 - qrSize - 5; // 5mm from right edge
      const qrY = (53.98 - qrSize) / 2; // Centered vertically
      doc.roundedRect(qrX - 1, qrY - 1, qrSize + 2, qrSize + 2, 2, 2, 'S');
      doc.addImage(qrCodeUrl, 'PNG', qrX, qrY, qrSize, qrSize);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }

    // Add back side
    doc.addPage([85.6, 53.98], 'landscape');
    
    // Add subtle background pattern
    doc.setGlobalAlpha(0.05);
    for (let i = 0; i < 85.6; i += 5) {
      for (let j = 0; j < 53.98; j += 5) {
        doc.setFillColor(selectedStyle.colors.primary);
        doc.circle(i, j, 0.5, 'F');
      }
    }
    doc.setGlobalAlpha(1);

    // Add logo
    try {
      // Center the logo on the back
      const logoSize = 30;
      const logoX = (85.6 - logoSize) / 2;
      const logoY = (53.98 - logoSize) / 2;
      
      doc.addImage(
        "/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png",
        "PNG",
        logoX,
        logoY,
        logoSize,
        logoSize
      );

      // Add decorative border
      doc.setDrawColor(selectedStyle.colors.primary);
      doc.setLineWidth(0.5);
      const margin = 5;
      doc.roundedRect(margin, margin, 85.6 - 2 * margin, 53.98 - 2 * margin, 3, 3, 'S');
    } catch (error) {
      console.error('Error adding logo:', error);
    }

  } catch (error) {
    console.error('Error generating business card:', error);
  }

  return doc;
};