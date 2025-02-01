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
    // Front side of the card
    // Set background with style-specific gradient
    doc.setFillColor(selectedStyle.colors.background.card);
    
    // Apply gradient background based on style
    doc.setGlobalAlpha(0.1);
    doc.rect(0, 0, 85.6, 53.98, 'F');
    doc.setGlobalAlpha(1);

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
      width: 30,
      color: {
        dark: selectedStyle.colors.text.primary,
        light: '#FFFFFF',
      },
    });

    // Add QR code to the bottom right corner with reduced size
    doc.addImage(
      qrCodeDataUrl,
      'PNG',
      65,
      30,
      15,
      15
    );

    // Add back side of the card
    doc.addPage();
    
    // Set background color based on style
    doc.setFillColor(selectedStyle.colors.background.card);
    doc.rect(0, 0, 85.6, 53.98, 'F');

    // Add style-specific gradient overlay
    doc.setGlobalAlpha(0.1);
    doc.setFillColor(selectedStyle.colors.primary);
    doc.rect(0, 0, 85.6, 53.98, 'F');
    doc.setGlobalAlpha(1);

    // Add app logo as centered watermark
    const logoUrl = "/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png";
    doc.setGlobalAlpha(0.8);
    doc.addImage(
      logoUrl,
      'PNG',
      32.8, // Centered horizontally (85.6/2 - 10)
      17,   // Centered vertically (53.98/2 - 10)
      20,   // Width
      20    // Height
    );
    doc.setGlobalAlpha(1);

  } catch (error) {
    console.error('Error generating business card:', error);
  }

  return doc;
};