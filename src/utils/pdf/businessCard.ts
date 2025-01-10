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
      const location = [profile.city, profile.state, profile.country].filter(Boolean).join(', ');
      doc.text(location, 10, contactY);
    }

    // Add back side with professional design
    doc.addPage([85.6, 53.98], 'landscape');
    
    // Add subtle pattern background
    doc.setGlobalAlpha(0.05);
    for (let i = 0; i < 85.6; i += 5) {
      for (let j = 0; j < 53.98; j += 5) {
        doc.setFillColor(selectedStyle.colors.primary);
        doc.circle(i, j, 0.3, 'F');
      }
    }
    doc.setGlobalAlpha(1);

    // Add company info if available
    if (profile.company_name) {
      doc.setTextColor(selectedStyle.colors.text.primary);
      doc.setFont(selectedStyle.font.split(",")[0].replace(/['"]+/g, ''), 'bold');
      doc.setFontSize(14);
      doc.text(profile.company_name, 10, 20);

      if (profile.company_size) {
        doc.setFont(selectedStyle.font.split(",")[0].replace(/['"]+/g, ''), 'normal');
        doc.setFontSize(10);
        doc.setTextColor(selectedStyle.colors.text.secondary);
        doc.text(`Taille: ${profile.company_size}`, 10, 27);
      }
    }

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