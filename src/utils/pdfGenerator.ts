import jsPDF from 'jspdf';
import type { UserProfile } from '@/types/profile';
import { supabase } from "@/integrations/supabase/client";
import QRCode from 'qrcode';

export const generateVCardPDF = async (profile: UserProfile): Promise<string> => {
  const doc = new jsPDF();
  
  // Professional colors with gradients
  const primaryColor = "#4F46E5"; // Indigo-600
  const secondaryColor = "#6366F1"; // Indigo-500
  const accentColor = "#EC4899"; // Pink-500
  const textColor = "#1F2937"; // Gray-800
  const lightGray = "#F3F4F6"; // Gray-100
  
  // Background pattern
  for (let i = 0; i < doc.internal.pageSize.width; i += 10) {
    for (let j = 0; j < doc.internal.pageSize.height; j += 10) {
      doc.setFillColor(245, 245, 245);
      doc.circle(i, j, 0.5, 'F');
    }
  }
  
  // Header gradient background
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 210, 60, "F");
  
  // Add subtle pattern to header
  doc.setFillColor(255, 255, 255);
  doc.setGlobalAlpha(0.1);
  for (let i = 0; i < 210; i += 5) {
    doc.line(i, 0, i + 10, 60);
  }
  doc.setGlobalAlpha(1);
  
  // Generate and add QR code
  const qrCodeDataUrl = await QRCode.toDataURL(window.location.href, {
    width: 100,
    margin: 1,
    color: {
      dark: "#000",
      light: "#FFF"
    }
  });
  
  // Add QR code with white background
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(155, 8, 40, 40, 3, 3, 'F');
  doc.addImage(qrCodeDataUrl, 'PNG', 160, 10, 30, 30);
  
  // Profile information with improved styling
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text(profile.full_name || "Nom non défini", 20, 30);
  
  doc.setFontSize(20);
  doc.setFont("helvetica", "normal");
  doc.text(profile.role || "Titre non défini", 20, 45);
  
  // Contact information with icons and sections
  const startY = 80;
  doc.setTextColor(textColor);
  
  // Contact section
  doc.setFillColor(lightGray);
  doc.roundedRect(15, startY - 10, 180, 50, 3, 3, 'F');
  
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Contact", 20, startY);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Email: ${profile.email || 'Non spécifié'}`, 25, startY + 12);
  doc.text(`Téléphone: ${profile.phone || 'Non spécifié'}`, 25, startY + 24);
  const location = [profile.city, profile.state, profile.country].filter(Boolean).join(', ');
  doc.text(`Localisation: ${location || 'Non spécifiée'}`, 25, startY + 36);
  
  // Skills section with modern badges
  const skillsStartY = startY + 70;
  doc.setFillColor(lightGray);
  doc.roundedRect(15, skillsStartY - 10, 180, 80, 3, 3, 'F');
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Compétences", 20, skillsStartY);
  
  const skills = profile.skills || [];
  let currentY = skillsStartY + 15;
  let currentX = 25;
  
  doc.setFontSize(11);
  skills.forEach((skill, index) => {
    const textWidth = doc.getTextWidth(skill) + 10;
    
    // Check if we need to move to next line
    if (currentX + textWidth > 185) {
      currentX = 25;
      currentY += 20;
    }
    
    // Draw skill badge with gradient-like effect
    doc.setFillColor(secondaryColor);
    doc.roundedRect(currentX - 2, currentY - 5, textWidth, 10, 2, 2, 'F');
    
    // Add subtle highlight
    doc.setFillColor(255, 255, 255);
    doc.setGlobalAlpha(0.1);
    doc.roundedRect(currentX - 2, currentY - 5, textWidth, 5, 2, 2, 'F');
    doc.setGlobalAlpha(1);
    
    // Skill text
    doc.setTextColor(255, 255, 255);
    doc.text(skill, currentX + 3, currentY);
    
    currentX += textWidth + 10;
  });
  
  // Certifications section with timeline-like design
  if (profile.certifications && profile.certifications.length > 0) {
    const certStartY = currentY + 50;
    doc.setFillColor(lightGray);
    doc.roundedRect(15, certStartY - 10, 180, 80, 3, 3, 'F');
    
    doc.setTextColor(textColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Certifications", 20, certStartY);
    
    let certY = certStartY + 15;
    profile.certifications.forEach((cert: any, index: number) => {
      // Timeline dot
      doc.setFillColor(accentColor);
      doc.circle(25, certY, 2, 'F');
      
      // Certification details
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(cert.title, 35, certY);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`${cert.institution} - ${cert.year}`, 35, certY + 7);
      
      certY += 20;
    });
  }
  
  // Footer with logo and website
  const pageHeight = doc.internal.pageSize.height;
  doc.setFillColor(primaryColor);
  doc.rect(0, pageHeight - 20, 210, 20, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("Généré via Victaure", 20, pageHeight - 8);
  
  if (profile.website) {
    doc.setTextColor(255, 255, 255);
    doc.text(profile.website, 120, pageHeight - 8);
  }
  
  // Generate PDF blob and upload to Supabase Storage
  const pdfBlob = doc.output('blob');
  const filename = `${crypto.randomUUID()}_${Date.now()}.pdf`;
  
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
  
  const { data: { publicUrl } } = supabase
    .storage
    .from('vcards')
    .getPublicUrl(filename);
    
  return publicUrl;
};