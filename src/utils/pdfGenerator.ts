import jsPDF from 'jspdf';
import type { UserProfile } from '@/types/profile';
import { supabase } from "@/integrations/supabase/client";
import QRCode from 'qrcode';

export const generateVCardPDF = async (profile: UserProfile): Promise<string> => {
  try {
    const doc = new jsPDF();
    
    // Set background
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Add header
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 60, 'F');
    
    // Add profile information
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text(profile.full_name || 'Professional Profile', 20, 30);
    
    doc.setFontSize(16);
    doc.text(profile.role || '', 20, 45);
    
    // Contact Information Section
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(14);
    doc.text('Contact Information', 20, 80);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    let currentY = 95;
    
    const contactInfo = [
      `Email: ${profile.email || ''}`,
      `Phone: ${profile.phone || ''}`,
      `Location: ${[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}`,
    ].filter(Boolean);
    
    contactInfo.forEach((info) => {
      doc.text(info, 20, currentY);
      currentY += 10;
    });
    
    // Generate QR Code
    const qrCodeUrl = await QRCode.toDataURL(window.location.href);
    doc.addImage(qrCodeUrl, 'PNG', 150, currentY - 50, 40, 40);
    
    // Skills Section
    currentY += 20;
    if (profile.skills && profile.skills.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text('Skills', 20, currentY);
      currentY += 10;
      
      doc.setFont("helvetica", "normal");
      const skillsText = profile.skills.join(', ');
      const splitSkills = doc.splitTextToSize(skillsText, 170);
      doc.text(splitSkills, 20, currentY);
      currentY += (splitSkills.length * 7) + 15;
    }

    // Generate the PDF blob
    const pdfBlob = doc.output('blob');
    const storageFileName = `${profile.id}_${Date.now()}.pdf`;
    
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase
      .storage
      .from('vcards')
      .upload(storageFileName, pdfBlob, {
        contentType: 'application/pdf',
        cacheControl: '3600'
      });
      
    if (uploadError) throw uploadError;

    // Get and return the Supabase storage URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('vcards')
      .getPublicUrl(storageFileName);
    
    return publicUrl;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};