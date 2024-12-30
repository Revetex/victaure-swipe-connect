import jsPDF from 'jspdf';
import type { UserProfile } from '@/types/profile';
import { supabase } from "@/integrations/supabase/client";
import QRCode from 'qrcode';

export const generateVCardPDF = async (profile: UserProfile): Promise<string> => {
  // Create new PDF document
  const doc = new jsPDF();
  
  // Set default font
  doc.setFont("helvetica");
  
  // Header section with solid background
  doc.setFillColor(79, 70, 229); // Indigo color
  doc.rect(0, 0, 210, 50, "F");
  
  // Add profile name and role
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text(profile.full_name || "Nom non défini", 20, 30);
  
  doc.setFontSize(16);
  doc.text(profile.role || "Titre non défini", 20, 42);
  
  // Generate and add QR code
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(window.location.href);
    doc.addImage(qrCodeDataUrl, 'PNG', 160, 10, 30, 30);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
  
  // Contact information section
  const startY = 70;
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(15, startY - 10, 180, 50, 3, 3, 'F');
  
  doc.setFontSize(16);
  doc.text("Contact", 20, startY);
  
  doc.setFontSize(12);
  doc.text(`Email: ${profile.email || 'Non spécifié'}`, 25, startY + 12);
  doc.text(`Téléphone: ${profile.phone || 'Non spécifié'}`, 25, startY + 24);
  const location = [profile.city, profile.state, profile.country].filter(Boolean).join(', ');
  doc.text(`Localisation: ${location || 'Non spécifiée'}`, 25, startY + 36);
  
  // Skills section
  const skillsStartY = startY + 70;
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(15, skillsStartY - 10, 180, 60, 3, 3, 'F');
  
  doc.setFontSize(16);
  doc.text("Compétences", 20, skillsStartY);
  
  const skills = profile.skills || [];
  let currentY = skillsStartY + 12;
  let currentX = 25;
  
  doc.setFontSize(11);
  skills.forEach((skill) => {
    const textWidth = doc.getTextWidth(skill) + 10;
    
    if (currentX + textWidth > 185) {
      currentX = 25;
      currentY += 12;
    }
    
    doc.setFillColor(79, 70, 229);
    doc.roundedRect(currentX - 2, currentY - 5, textWidth, 10, 2, 2, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.text(skill, currentX + 3, currentY);
    doc.setTextColor(0, 0, 0);
    
    currentX += textWidth + 10;
  });
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFillColor(79, 70, 229);
  doc.rect(0, pageHeight - 20, 210, 20, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("Généré via Victaure", 20, pageHeight - 8);
  
  if (profile.website) {
    doc.text(profile.website, 120, pageHeight - 8);
  }
  
  // Generate blob and upload to Supabase Storage
  try {
    const pdfBlob = doc.output('blob');
    const filename = `${profile.id}_${Date.now()}.pdf`;
    
    const { data, error } = await supabase
      .storage
      .from('vcards')
      .upload(filename, pdfBlob, {
        contentType: 'application/pdf',
        upsert: true
      });
      
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase
      .storage
      .from('vcards')
      .getPublicUrl(filename);
      
    return publicUrl;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
};