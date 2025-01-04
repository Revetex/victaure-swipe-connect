import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { pdfColors } from './colors';
import { extendPdfDocument } from "./pdfExtensions";

export const generateCV = async (profile: UserProfile): Promise<ExtendedJsPDF> => {
  const doc = extendPdfDocument(new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  }));

  let currentY = 10;

  // Header section
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(profile.full_name || 'No Name', 20, currentY);
  currentY = doc.addSpace(10);

  // Role
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text(profile.role || 'No Role', 20, currentY);
  currentY = doc.addSpace(10);

  // Bio
  if (profile.bio) {
    doc.setFontSize(12);
    const bioLines = doc.splitTextToSize(profile.bio, 170);
    doc.text(bioLines, 20, currentY);
    currentY = doc.addSpace(bioLines.length * 5 + 10);
  }

  // Contact Info
  doc.setFontSize(12);
  doc.text(`Email: ${profile.email}`, 20, currentY);
  currentY = doc.addSpace(5);
  if (profile.phone) {
    doc.text(`Phone: ${profile.phone}`, 20, currentY);
    currentY = doc.addSpace(5);
  }

  // Skills
  if (profile.skills && profile.skills.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Skills', 20, currentY);
    currentY = doc.addSpace(5);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    const skillsText = profile.skills.join(', ');
    const skillsLines = doc.splitTextToSize(skillsText, 170);
    doc.text(skillsLines, 20, currentY);
    currentY = doc.addSpace(skillsLines.length * 5 + 10);
  }

  // Footer
  doc.setTextColor(pdfColors.text.muted);
  doc.setFontSize(10);
  doc.text('Generated with Victaure', 105, 287, { align: 'center' });

  return doc;
};