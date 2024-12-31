import jsPDF from 'jspdf';
import type { UserProfile } from '@/types/profile';
import { supabase } from "@/integrations/supabase/client";

export const generateVCardPDF = async (profile: UserProfile): Promise<string> => {
  try {
    const doc = new jsPDF();
    
    // Add Victaure branding
    doc.setFillColor(26, 31, 44); // Dark background
    doc.rect(0, 0, 210, 297, 'F');
    
    // Add gradient-like effect
    doc.setFillColor(58, 63, 76);
    doc.rect(0, 0, 210, 50, 'F');
    
    // Add Victaure logo if available
    // You would need to add the logo to your assets
    // doc.addImage('path_to_victaure_logo', 'PNG', 10, 10, 50, 20);
    
    // Set text colors and fonts
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    
    // Add profile information
    doc.setFontSize(24);
    doc.text(profile.full_name || 'Professional Profile', 20, 40);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(profile.role || '', 20, 50);
    
    // Add contact information
    doc.setFontSize(12);
    const contactInfo = [
      `Email: ${profile.email}`,
      `Phone: ${profile.phone || 'Not provided'}`,
      `Location: ${[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}`,
    ];
    
    contactInfo.forEach((info, index) => {
      doc.text(info, 20, 70 + (index * 10));
    });
    
    // Add skills section
    if (profile.skills && profile.skills.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text('Skills', 20, 110);
      doc.setFont("helvetica", "normal");
      const skillsText = profile.skills.join(', ');
      doc.text(skillsText, 20, 120);
    }
    
    // Add bio if available
    if (profile.bio) {
      doc.setFont("helvetica", "bold");
      doc.text('About', 20, 140);
      doc.setFont("helvetica", "normal");
      doc.text(profile.bio, 20, 150);
    }
    
    // Add footer with Victaure branding
    doc.setFontSize(10);
    doc.setTextColor(155, 135, 245); // Victaure purple
    doc.text('Powered by Victaure', 20, 280);
    
    // Save the PDF
    const pdfOutput = doc.output('blob');
    const filename = `${profile.id}_${Date.now()}.pdf`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from('vcards')
      .upload(filename, pdfOutput, {
        contentType: 'application/pdf',
        cacheControl: '3600'
      });
      
    if (error) throw error;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('vcards')
      .getPublicUrl(filename);
      
    return publicUrl;
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};