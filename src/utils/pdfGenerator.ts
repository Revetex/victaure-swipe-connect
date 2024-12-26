import jsPDF from 'jspdf';
import type { UserProfile } from '@/data/mockProfile';

export const generateVCardPDF = (profile: UserProfile): string => {
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
  
  // Generate PDF as base64
  const pdfOutput = doc.output('datauristring');
  return pdfOutput;
};