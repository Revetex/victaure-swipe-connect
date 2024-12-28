import jsPDF from 'jspdf';
import type { UserProfile } from '@/data/mockProfile';
import { supabase } from "@/integrations/supabase/client";

export const generateVCardPDF = async (profile: UserProfile): Promise<string> => {
  // Créer un nouveau document PDF
  const doc = new jsPDF();
  
  // Définir les couleurs et styles
  const primaryColor = "#6366f1"; // Indigo
  const secondaryColor = "#4f46e5"; // Indigo plus foncé
  
  // En-tête avec le nom et le titre
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 210, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text(profile.name, 20, 20);
  
  doc.setFontSize(16);
  doc.text(profile.title || "Professional", 20, 30);
  
  // Informations de contact
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Contact", 20, 50);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Email: ${profile.email}`, 25, 60);
  doc.text(`Téléphone: ${profile.phone || 'Non spécifié'}`, 25, 70);
  doc.text(`Localisation: ${[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}`, 25, 80);
  
  // Compétences
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Compétences", 20, 100);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const skills = profile.skills || [];
  let yPos = 110;
  let xPos = 25;
  
  skills.forEach((skill, index) => {
    // Créer un effet de badge pour chaque compétence
    const textWidth = doc.getTextWidth(skill);
    doc.setFillColor(secondaryColor);
    doc.roundedRect(xPos - 2, yPos - 5, textWidth + 10, 10, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.text(skill, xPos, yPos);
    
    // Passer à la ligne suivante tous les 3 skills
    if ((index + 1) % 3 === 0) {
      yPos += 15;
      xPos = 25;
    } else {
      xPos += textWidth + 20;
    }
  });
  
  // Générer le PDF comme blob
  const pdfBlob = doc.output('blob');
  
  // Créer un nom de fichier unique
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