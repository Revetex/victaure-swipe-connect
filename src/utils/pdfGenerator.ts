import jsPDF from 'jspdf';
import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from '@/data/mockProfile';

export const generateVCardPDF = async (profile: UserProfile): Promise<string> => {
  const doc = new jsPDF();
  
  // Add content to PDF
  doc.setFontSize(20);
  doc.text(profile.name, 20, 20);
  
  doc.setFontSize(14);
  doc.text(profile.title, 20, 30);
  
  doc.setFontSize(12);
  doc.text('Contact', 20, 45);
  doc.text(`Email: ${profile.email}`, 25, 55);
  doc.text(`Phone: ${profile.phone || 'N/A'}`, 25, 65);
  doc.text(`Location: ${[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}`, 25, 75);
  
  doc.text('Skills', 20, 90);
  const skills = profile.skills.join(', ');
  doc.text(skills, 25, 100);
  
  // Generate PDF as blob
  const pdfBlob = doc.output('blob');
  
  // Create a unique filename
  const filename = `${profile.id}_${Date.now()}.pdf`;
  
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