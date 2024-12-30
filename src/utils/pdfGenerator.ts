import jsPDF from 'jspdf';
import type { UserProfile } from '@/types/profile';
import { supabase } from "@/integrations/supabase/client";
import QRCode from 'qrcode';

export const generateVCardPDF = async (profile: UserProfile): Promise<string> => {
  const doc = new jsPDF();
  
  // Couleurs professionnelles
  const primaryColor = "#4F46E5"; // Indigo-600
  const secondaryColor = "#6366F1"; // Indigo-500
  const textColor = "#1F2937"; // Gray-800
  
  // Ajout du logo Victaure
  const logoImg = new Image();
  logoImg.src = "/lovable-uploads/193c092a-9104-486d-a72a-0d882d86ce20.png";
  doc.addImage(logoImg, 'PNG', 10, 10, 30, 30);
  
  // En-tête avec dégradé
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 210, 50, "F");
  
  // Génération du QR Code
  const qrCodeDataUrl = await QRCode.toDataURL(window.location.href, {
    width: 100,
    margin: 1,
    color: {
      dark: "#000",
      light: "#FFF"
    }
  });
  
  // Ajout du QR code en haut à droite
  doc.addImage(qrCodeDataUrl, 'PNG', 160, 10, 30, 30);
  
  // Nom et titre
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text(profile.full_name || "Nom non défini", 50, 30);
  
  doc.setFontSize(18);
  doc.setFont("helvetica", "normal");
  doc.text(profile.role || "Titre non défini", 50, 42);
  
  // Informations de contact
  doc.setTextColor(textColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Contact", 20, 70);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Email: ${profile.email}`, 25, 82);
  doc.text(`Téléphone: ${profile.phone || 'Non spécifié'}`, 25, 92);
  doc.text(`Localisation: ${[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}`, 25, 102);
  
  // Compétences avec badges stylisés
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Compétences", 20, 122);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const skills = profile.skills || [];
  let yPos = 132;
  let xPos = 25;
  
  skills.forEach((skill, index) => {
    const textWidth = doc.getTextWidth(skill) + 10;
    
    // Badge avec fond
    doc.setFillColor(secondaryColor);
    doc.roundedRect(xPos - 2, yPos - 5, textWidth, 10, 2, 2, "F");
    
    // Texte du badge
    doc.setTextColor(255, 255, 255);
    doc.text(skill, xPos + 3, yPos);
    
    // Positionnement du prochain badge
    if (xPos + textWidth + 30 > 190) {
      xPos = 25;
      yPos += 15;
    } else {
      xPos += textWidth + 10;
    }
  });
  
  // Certifications
  if (profile.certifications && profile.certifications.length > 0) {
    yPos += 30;
    doc.setTextColor(textColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Certifications", 20, yPos);
    
    profile.certifications.forEach((cert, index) => {
      yPos += 15;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(cert.title, 25, yPos);
      
      yPos += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`${cert.institution} - ${cert.year}`, 25, yPos);
    });
  }
  
  // Pied de page avec logo
  const pageHeight = doc.internal.pageSize.height;
  doc.setFillColor(primaryColor);
  doc.rect(0, pageHeight - 20, 210, 20, "F");
  
  // Ajout du petit logo dans le pied de page
  doc.addImage(logoImg, 'PNG', 10, pageHeight - 15, 10, 10);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("Généré via Victaure", 25, pageHeight - 8);
  
  // Générer le PDF comme blob
  const pdfBlob = doc.output('blob');
  const filename = `${crypto.randomUUID()}_${Date.now()}.pdf`;
  
  // Upload vers Supabase Storage
  const { data, error } = await supabase
    .storage
    .from('vcards')
    .upload(filename, pdfBlob, {
      contentType: 'application/pdf',
      upsert: true
    });
    
  if (error) {
    console.error('Erreur lors de l\'upload du PDF:', error);
    throw error;
  }
  
  // Obtenir l'URL publique
  const { data: { publicUrl } } = supabase
    .storage
    .from('vcards')
    .getPublicUrl(filename);
    
  return publicUrl;
};