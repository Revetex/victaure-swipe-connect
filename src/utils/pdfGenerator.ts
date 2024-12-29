import jsPDF from 'jspdf';
import type { UserProfile } from '@/types/profile';
import { supabase } from "@/integrations/supabase/client";

export const generateVCardPDF = async (profile: UserProfile): Promise<string> => {
  const doc = new jsPDF();
  
  // Couleurs professionnelles
  const primaryColor = "#4F46E5"; // Indigo-600
  const secondaryColor = "#6366F1"; // Indigo-500
  const textColor = "#1F2937"; // Gray-800
  
  // En-tête avec dégradé
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 210, 50, "F");
  
  // Nom et titre
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text(profile.full_name || "Nom non défini", 20, 30);
  
  doc.setFontSize(18);
  doc.setFont("helvetica", "normal");
  doc.text(profile.role || "Titre non défini", 20, 42);
  
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
  
  // Pied de page
  const pageHeight = doc.internal.pageSize.height;
  doc.setFillColor(primaryColor);
  doc.rect(0, pageHeight - 20, 210, 20, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("Généré via Victaure", 20, pageHeight - 8);
  
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