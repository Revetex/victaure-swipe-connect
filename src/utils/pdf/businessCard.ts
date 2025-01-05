import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { StyleOption } from "@/components/vcard/types";
import QRCode from "qrcode";

export const generateBusinessCard = async (
  profile: UserProfile,
  selectedStyle: StyleOption
): Promise<jsPDF> => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85, 55]
  });

  // Couleurs du style sélectionné
  const primaryColor = selectedStyle?.color || '#9b87f5';
  const secondaryColor = selectedStyle?.secondaryColor || '#7E69AB';

  // Fond avec dégradé
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 85, 55, 'F');

  // Police personnalisée
  const fontFamily = selectedStyle?.font || 'helvetica';
  doc.setFont(fontFamily);

  // Photo de profil ronde (plus petite)
  if (profile.avatar_url) {
    try {
      const img = new Image();
      img.src = profile.avatar_url;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      // Dimensions réduites pour la photo
      const size = 12; // Taille encore plus petite
      const x = 5;
      const y = 5;
      
      // Créer un masque rond plus petit
      doc.setFillColor(255, 255, 255);
      doc.circle(x + size/2, y + size/2, size/2, 'F');
      
      // Ajouter l'image
      doc.addImage(img, 'PNG', x, y, size, size);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'avatar:', error);
    }
  }

  // Informations de contact avec meilleur espacement
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14); // Taille de police réduite
  doc.setFont(fontFamily, 'bold');
  doc.text(profile.full_name || 'Non défini', 20, 10);

  doc.setFontSize(10); // Taille de police plus petite pour le rôle
  doc.setFont(fontFamily, 'normal');
  doc.text(profile.role || 'Non défini', 20, 15);

  // Coordonnées avec meilleur espacement
  doc.setFontSize(8);
  let yPos = 25;
  
  if (profile.email) {
    doc.text(`${profile.email}`, 20, yPos);
    yPos += 4;
  }
  
  if (profile.phone) {
    doc.text(`${profile.phone}`, 20, yPos);
    yPos += 4;
  }
  
  if (profile.city) {
    doc.text(`${profile.city}, ${profile.state || 'QC'}`, 20, yPos);
  }

  // QR Code plus petit et mieux positionné
  try {
    const qrCodeUrl = await QRCode.toDataURL(window.location.href);
    doc.addImage(qrCodeUrl, 'PNG', 68, 38, 12, 12);
  } catch (error) {
    console.error('Erreur lors de la génération du QR code:', error);
  }

  return doc;
};