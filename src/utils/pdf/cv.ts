import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { pdfColors } from './colors';
import { extendPdfDocument } from "./pdfExtensions";
import { StyleOption } from "@/components/vcard/types";
import QRCode from "qrcode";

export const generateCV = async (profile: UserProfile): Promise<ExtendedJsPDF> => {
  const doc = extendPdfDocument(new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  }));

  let currentY = 20;

  // En-tête avec photo et QR code
  if (profile.avatar_url) {
    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = profile.avatar_url;
      });

      // Ajuster la taille et la position de la photo
      const imgWidth = 35;
      const imgHeight = 35;
      const imgX = 20;
      
      doc.addImage(img, 'JPEG', imgX, currentY, imgWidth, imgHeight, undefined, 'MEDIUM');
      
      // Générer et ajouter le QR code
      const qrCodeUrl = await QRCode.toDataURL(window.location.href);
      doc.addImage(qrCodeUrl, 'PNG', 160, currentY, 30, 30);
      
      currentY += imgHeight + 10;
    } catch (error) {
      console.error('Erreur lors du chargement de l\'image:', error);
      currentY += 10;
    }
  }

  // Informations principales
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(profile.full_name || 'Non défini', 20, currentY);
  currentY += 10;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text(profile.role || 'Non défini', 20, currentY);
  currentY += 15;

  // Bio
  if (profile.bio) {
    doc.setFontSize(12);
    const bioLines = doc.splitTextToSize(profile.bio, 170);
    doc.text(bioLines, 20, currentY);
    currentY += bioLines.length * 5 + 10;
  }

  // Contact
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

  // Compétences
  if (profile.skills && profile.skills.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Compétences', 20, currentY);
    currentY += 6;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    const skillsText = profile.skills.join(', ');
    const skillsLines = doc.splitTextToSize(skillsText, 170);
    doc.text(skillsLines, 20, currentY);
    currentY += skillsLines.length * 5 + 10;
  }

  // Pied de page
  doc.setFontSize(10);
  doc.text('Généré avec Victaure', 105, 287, { align: 'center' });

  return doc;
};