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
    format: [85.6, 53.98],
    compress: true
  }));

  // Front side
  try {
    // Metallic gradient background
    doc.setFillColor(240, 240, 242);
    doc.rect(0, 0, 85.6, 53.98, 'F');
    
    // Add subtle metallic pattern
    doc.setGlobalAlpha(0.05);
    for (let i = 0; i < 85.6; i += 2) {
      for (let j = 0; j < 53.98; j += 2) {
        doc.setFillColor(220, 220, 225);
        doc.circle(i, j, 0.2, 'F');
      }
    }
    doc.setGlobalAlpha(1);

    // Add metallic accent line
    const gradient = doc.setLineDash([0.5, 0.5]);
    doc.setDrawColor(180, 180, 190);
    doc.setLineWidth(0.3);
    doc.line(10, 12, 75.6, 12);

    // Add name with professional styling
    doc.setTextColor(40, 40, 50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(profile.full_name || '', 10, 20);
    
    // Add role with elegant styling
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 90);
    doc.text(profile.role || '', 10, 27);

    // Add contact details with refined layout
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 70);
    let contactY = 35;
    
    if (profile.email) {
      doc.text(`${profile.email}`, 10, contactY);
      contactY += 5;
    }
    
    if (profile.phone) {
      doc.text(`${profile.phone}`, 10, contactY);
      contactY += 5;
    }
    
    if (profile.city) {
      const location = [profile.city, profile.state, profile.country]
        .filter(Boolean)
        .join(', ');
      doc.text(location, 10, contactY);
    }

    // Add metallic border
    doc.setDrawColor(200, 200, 210);
    doc.setLineWidth(0.3);
    doc.roundedRect(3, 3, 79.6, 47.98, 2, 2, 'S');

    // Back side
    doc.addPage([85.6, 53.98], 'landscape');
    
    // Metallic background for back
    doc.setFillColor(245, 245, 247);
    doc.rect(0, 0, 85.6, 53.98, 'F');
    
    // Add subtle metallic pattern
    doc.setGlobalAlpha(0.03);
    for (let i = 0; i < 85.6; i += 2) {
      for (let j = 0; j < 53.98; j += 2) {
        doc.setFillColor(230, 230, 235);
        doc.circle(i, j, 0.2, 'F');
      }
    }
    doc.setGlobalAlpha(1);

    // Add Victaure logo
    try {
      doc.addImage(
        "/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png",
        "PNG",
        10,
        10,
        20,
        20
      );
    } catch (error) {
      console.error('Error adding Victaure logo:', error);
    }

    // Generate and add QR code
    try {
      const qrDataUrl = await QRCode.toDataURL(window.location.href, {
        margin: 0,
        width: 256,
        color: {
          dark: '#2B2B2B',
          light: '#FFFFFF'
        }
      });
      doc.addImage(qrDataUrl, 'PNG', 55, 10, 20, 20);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }

    // Add company info with metallic styling
    if (profile.company_name) {
      doc.setTextColor(50, 50, 60);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(profile.company_name, 10, 40);

      if (profile.company_size) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(90, 90, 100);
        doc.text(`Taille: ${profile.company_size}`, 10, 45);
      }
    }

    // Add metallic border to back
    doc.setDrawColor(200, 200, 210);
    doc.setLineWidth(0.3);
    doc.roundedRect(3, 3, 79.6, 47.98, 2, 2, 'S');

  } catch (error) {
    console.error('Error generating business card:', error);
  }

  return doc;
};