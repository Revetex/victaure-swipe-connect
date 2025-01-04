import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { pdfStyles } from '../styles';
import { extendPdfDocument } from "../pdfExtensions";
import { StyleOption } from "@/components/vcard/types";
import QRCode from "qrcode";

export const generateCV = async (
  profile: UserProfile, 
  selectedStyle: StyleOption
): Promise<ExtendedJsPDF> => {
  try {
    const doc = extendPdfDocument(new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    }));

    // Set initial position
    let currentY = 20;

    // Header with name and role
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(profile.full_name || 'Non défini', 20, currentY);
    currentY += 10;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text(profile.role || 'Non défini', 20, currentY);
    currentY += 15;

    // Contact information
    doc.setFontSize(12);
    doc.text(`Email: ${profile.email}`, 20, currentY);
    currentY += 6;
    
    if (profile.phone) {
      doc.text(`Téléphone: ${profile.phone}`, 20, currentY);
      currentY += 6;
    }
    
    if (profile.city || profile.state) {
      doc.text(`Localisation: ${[profile.city, profile.state].filter(Boolean).join(', ')}`, 20, currentY);
      currentY += 10;
    }

    // Bio section if available
    if (profile.bio) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('À propos', 20, currentY);
      currentY += 8;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      const bioLines = doc.splitTextToSize(profile.bio, 170);
      doc.text(bioLines, 20, currentY);
      currentY += bioLines.length * 5 + 10;
    }

    // Skills section
    if (profile.skills && profile.skills.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Compétences', 20, currentY);
      currentY += 8;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      const skillsText = profile.skills.join(' • ');
      const skillsLines = doc.splitTextToSize(skillsText, 170);
      doc.text(skillsLines, 20, currentY);
      currentY += skillsLines.length * 5 + 10;
    }

    // Add QR code at the bottom
    try {
      const qrCodeUrl = await QRCode.toDataURL(window.location.href);
      doc.addImage(qrCodeUrl, 'PNG', 170, 250, 25, 25);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('Généré avec Victaure', 105, 287, { align: 'center' });

    return doc;
  } catch (error) {
    console.error('Error generating CV:', error);
    throw error;
  }
};