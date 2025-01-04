import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { StyleOption } from "@/components/vcard/types";
import QRCode from "qrcode";

export const generateCV = async (
  profile: UserProfile,
  style: StyleOption
): Promise<ExtendedJsPDF> => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    }) as ExtendedJsPDF;

    // Apply selected style colors
    const primaryColor = style.colors.primary;
    const secondaryColor = style.colors.secondary;
    const textColor = style.colors.text.primary;

    // Add header with primary color
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 40, 'F');

    // Add Victaure logo at the top left
    try {
      const logoImg = new Image();
      logoImg.src = "/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png";
      await new Promise((resolve, reject) => {
        logoImg.onload = resolve;
        logoImg.onerror = reject;
      });
      doc.addImage(logoImg, 'PNG', 15, 10, 20, 20);
    } catch (error) {
      console.error('Error loading Victaure logo:', error);
    }

    // Set font styles based on the selected style
    doc.setFont(style.font || 'helvetica', 'bold');

    // Header with name and role
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text(profile.full_name || 'Non défini', 45, 20);
    
    doc.setFontSize(16);
    doc.setFont(style.font || 'helvetica', 'normal');
    doc.text(profile.role || 'Non défini', 45, 30);

    // Reset text color for content
    doc.setTextColor(textColor);

    let currentY = 50;

    // Bio section if available
    if (profile.bio) {
      doc.setFontSize(14);
      doc.setFont(style.font || 'helvetica', 'bold');
      doc.setTextColor(primaryColor);
      doc.text('À propos', 20, currentY);
      currentY += 8;
      
      doc.setTextColor(textColor);
      doc.setFont(style.font || 'helvetica', 'normal');
      doc.setFontSize(12);
      const bioLines = doc.splitTextToSize(profile.bio, 170);
      doc.text(bioLines, 20, currentY);
      currentY += bioLines.length * 5 + 10;
    }

    // Skills section
    if (profile.skills && profile.skills.length > 0) {
      doc.setFontSize(14);
      doc.setFont(style.font || 'helvetica', 'bold');
      doc.setTextColor(primaryColor);
      doc.text('Compétences', 20, currentY);
      currentY += 8;
      
      doc.setTextColor(textColor);
      doc.setFont(style.font || 'helvetica', 'normal');
      doc.setFontSize(12);
      const skillsText = profile.skills.join(' • ');
      const skillsLines = doc.splitTextToSize(skillsText, 170);
      doc.text(skillsLines, 20, currentY);
      currentY += skillsLines.length * 5 + 10;
    }

    // Contact information at the bottom
    doc.setTextColor(textColor);
    doc.setFontSize(12);
    let contactY = 250;
    
    if (profile.email) {
      doc.text(`Email: ${profile.email}`, 20, contactY);
      contactY += 6;
    }
    
    if (profile.phone) {
      doc.text(`Téléphone: ${profile.phone}`, 20, contactY);
      contactY += 6;
    }
    
    if (profile.city || profile.state) {
      doc.text(`Localisation: ${[profile.city, profile.state].filter(Boolean).join(', ')}`, 20, contactY);
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
    doc.rect(0, 287, 210, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('Généré avec Victaure', 105, 293, { align: 'center' });

    return doc;
  } catch (error) {
    console.error('Error generating CV:', error);
    throw error;
  }
};