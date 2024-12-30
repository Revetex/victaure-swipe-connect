import jsPDF from 'jspdf';
import type { UserProfile } from '@/types/profile';
import { supabase } from "@/integrations/supabase/client";
import QRCode from 'qrcode';

export const generateVCardPDF = async (profile: UserProfile): Promise<string> => {
  // Create new PDF document with French encoding
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    compress: true
  });
  
  // Set font
  doc.setFont("helvetica");
  
  // Header
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, 210, 40, "F");
  
  // Profile name and role
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  const name = profile.full_name || "Nom non défini";
  doc.text(name, 20, 25);
  
  if (profile.role) {
    doc.setFontSize(16);
    doc.text(profile.role, 20, 35);
  }
  
  // Generate QR code
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(window.location.href);
    doc.addImage(qrCodeDataUrl, 'PNG', 150, 5, 30, 30);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
  
  // Contact information
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text("Contact", 20, 50);
  
  doc.setFontSize(12);
  doc.text(`Email: ${profile.email || 'Non spécifié'}`, 25, 60);
  doc.text(`Téléphone: ${profile.phone || 'Non spécifié'}`, 25, 70);
  const location = [profile.city, profile.state, profile.country].filter(Boolean).join(', ');
  doc.text(`Localisation: ${location || 'Non spécifiée'}`, 25, 80);
  
  // Skills section
  doc.setFontSize(14);
  doc.text("Compétences", 20, 100);
  
  const skills = profile.skills || [];
  let currentY = 110;
  let currentX = 25;
  
  doc.setFontSize(10);
  skills.forEach((skill) => {
    const textWidth = doc.getTextWidth(skill) + 10;
    
    if (currentX + textWidth > 185) {
      currentX = 25;
      currentY += 12;
    }
    
    // Draw skill badge
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
  
  // Save PDF to Supabase Storage
  try {
    // Convert PDF to blob using the correct method
    const pdfOutput = new Blob([doc.output('arraybuffer')], { type: 'application/pdf' });
    const filename = `${profile.id}_${Date.now()}.pdf`;
    
    const { data, error } = await supabase
      .storage
      .from('vcards')
      .upload(filename, pdfOutput, {
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