import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { StyleOption } from "@/components/vcard/types";
import QRCode from "qrcode";

export const generateCV = async (
  profile: UserProfile,
  selectedStyle?: StyleOption
): Promise<ExtendedJsPDF> => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    }) as ExtendedJsPDF;

    // Set colors based on selected style or default
    const primaryColor = selectedStyle?.color || '#9b87f5';
    const secondaryColor = selectedStyle?.secondaryColor || '#7E69AB';

    // Add Victaure logo at the top left
    try {
      const logoImg = new Image();
      logoImg.src = "/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png";
      await new Promise((resolve, reject) => {
        logoImg.onload = resolve;
        logoImg.onerror = reject;
      });
      doc.addImage(logoImg, 'PNG', 20, 10, 15, 15);
    } catch (error) {
      console.error('Error loading Victaure logo:', error);
    }

    // Set initial position after logo
    let currentY = 35;

    // Set font family based on style or default
    const fontFamily = selectedStyle?.font || 'helvetica';
    doc.setFont(fontFamily);

    // Header with name and role using selected style
    doc.setTextColor(primaryColor);
    doc.setFontSize(24);
    doc.setFont(fontFamily, 'bold');
    doc.text(profile.full_name || 'Non défini', 20, currentY);
    currentY += 10;

    doc.setTextColor(secondaryColor);
    doc.setFontSize(16);
    doc.setFont(fontFamily, 'normal');
    doc.text(profile.role || 'Non défini', 20, currentY);
    currentY += 15;

    // Contact information
    doc.setTextColor(51, 51, 51);
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
      doc.setTextColor(primaryColor);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('À propos', 20, currentY);
      currentY += 8;
      
      doc.setTextColor(51, 51, 51);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      const bioLines = doc.splitTextToSize(profile.bio, 170);
      doc.text(bioLines, 20, currentY);
      currentY += bioLines.length * 5 + 10;
    }

    // Skills section
    if (profile.skills && profile.skills.length > 0) {
      doc.setTextColor(primaryColor);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Compétences', 20, currentY);
      currentY += 8;
      
      doc.setTextColor(51, 51, 51);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      const skillsText = profile.skills.join(' • ');
      const skillsLines = doc.splitTextToSize(skillsText, 170);
      doc.text(skillsLines, 20, currentY);
      currentY += skillsLines.length * 5 + 10;
    }

    // Add QR code at the bottom right
    try {
      const qrCodeUrl = await QRCode.toDataURL(window.location.href);
      doc.addImage(qrCodeUrl, 'PNG', 170, 250, 25, 25);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }

    // Footer with style-based color
    doc.setFillColor(primaryColor);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('Généré avec Victaure', 105, 287, { align: 'center' });

    return doc;
  } catch (error) {
    console.error('Error generating CV:', error);
    throw error;
  }
};
