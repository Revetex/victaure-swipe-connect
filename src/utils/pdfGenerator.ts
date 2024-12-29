import jsPDF from 'jspdf';
import type { UserProfile } from '@/types/profile';
import { supabase } from "@/integrations/supabase/client";

export const generateVCardPDF = async (profile: UserProfile): Promise<string> => {
  const doc = new jsPDF();
  
  // Professional colors
  const primaryColor = "#4F46E5";
  const secondaryColor = "#6366F1";
  const textColor = "#1F2937";
  
  // Header with gradient
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 210, 60, "F");
  
  // Profile name and title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text(profile.full_name || "Nom non défini", 20, 35);
  
  doc.setFontSize(20);
  doc.setFont("helvetica", "normal");
  doc.text(profile.role || "Titre non défini", 20, 50);
  
  // Contact information
  let yPos = 80;
  doc.setTextColor(textColor);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Contact", 20, yPos);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  yPos += 15;
  doc.text(`Email: ${profile.email}`, 25, yPos);
  yPos += 10;
  doc.text(`Téléphone: ${profile.phone || 'Non spécifié'}`, 25, yPos);
  yPos += 10;
  doc.text(`Localisation: ${[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}`, 25, yPos);
  
  // Bio section
  if (profile.bio) {
    yPos += 25;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("À propos", 20, yPos);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    yPos += 10;
    const bioLines = doc.splitTextToSize(profile.bio, 170);
    doc.text(bioLines, 25, yPos);
    yPos += (bioLines.length * 7) + 15;
  }
  
  // Skills with styled badges
  if (profile.skills && profile.skills.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Compétences", 20, yPos);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    let xPos = 25;
    yPos += 10;
    const startY = yPos;
    
    profile.skills.forEach((skill, index) => {
      const textWidth = doc.getTextWidth(skill) + 10;
      
      if (xPos + textWidth > 190) {
        xPos = 25;
        yPos += 12;
      }
      
      // Badge background
      doc.setFillColor(secondaryColor);
      doc.roundedRect(xPos - 2, yPos - 5, textWidth, 10, 2, 2, "F");
      
      // Badge text
      doc.setTextColor(255, 255, 255);
      doc.text(skill, xPos + 3, yPos);
      
      xPos += textWidth + 5;
    });
    
    yPos += 20;
  }
  
  // Certifications
  if (profile.certifications && profile.certifications.length > 0) {
    doc.setTextColor(textColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Certifications", 20, yPos);
    
    profile.certifications.forEach((cert) => {
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
  
  // Footer with QR code
  const pageHeight = doc.internal.pageSize.height;
  doc.setFillColor(primaryColor);
  doc.rect(0, pageHeight - 25, 210, 25, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  const currentDate = new Date().toLocaleDateString();
  doc.text(`Généré via Victaure le ${currentDate}`, 20, pageHeight - 10);
  
  // Generate PDF as blob
  const pdfBlob = doc.output('blob');
  const filename = `${crypto.randomUUID()}_${Date.now()}.pdf`;
  
  // Upload to Supabase Storage
  const { data, error } = await supabase
    .storage
    .from('vcards')
    .upload(filename, pdfBlob, {
      contentType: 'application/pdf',
      upsert: true
    });
    
  if (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase
    .storage
    .from('vcards')
    .getPublicUrl(filename);
    
  return publicUrl;
};