import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { pdfColors } from './colors';
import type { UserProfile } from '@/types/profile';

export const generateVCardPDF = async (profile: UserProfile) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Background
  doc.setFillColor(pdfColors.background);
  doc.rect(0, 0, 210, 297, 'F');

  // Header section
  doc.setFontSize(24);
  doc.setTextColor(pdfColors.text.primary);
  doc.text(profile.full_name || 'Nom complet', 20, 30);

  doc.setFontSize(16);
  doc.setTextColor(pdfColors.text.secondary);
  doc.text(profile.role || 'Rôle professionnel', 20, 40);

  // Contact Information
  doc.setFontSize(12);
  let yPosition = 60;
  const lineHeight = 8;

  if (profile.email) {
    doc.text(`Email: ${profile.email}`, 20, yPosition);
    yPosition += lineHeight;
  }

  if (profile.phone) {
    doc.text(`Téléphone: ${profile.phone}`, 20, yPosition);
    yPosition += lineHeight;
  }

  if (profile.city || profile.state || profile.country) {
    const location = [profile.city, profile.state, profile.country]
      .filter(Boolean)
      .join(', ');
    doc.text(`Adresse: ${location}`, 20, yPosition);
    yPosition += lineHeight * 2;
  }

  // Bio section if available
  if (profile.bio) {
    doc.setFontSize(14);
    doc.setTextColor(pdfColors.text.primary);
    doc.text('À propos', 20, yPosition);
    yPosition += lineHeight;

    doc.setFontSize(12);
    doc.setTextColor(pdfColors.text.secondary);
    const bioLines = doc.splitTextToSize(profile.bio, 170);
    doc.text(bioLines, 20, yPosition);
    yPosition += (bioLines.length * lineHeight) + lineHeight;
  }

  // Skills section
  if (profile.skills && profile.skills.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(pdfColors.text.primary);
    doc.text('Compétences', 20, yPosition);
    yPosition += lineHeight;

    doc.setFontSize(12);
    doc.setTextColor(pdfColors.text.secondary);
    const skillsText = profile.skills.join(' • ');
    const skillsLines = doc.splitTextToSize(skillsText, 170);
    doc.text(skillsLines, 20, yPosition);
    yPosition += (skillsLines.length * lineHeight) + lineHeight;
  }

  // Education section
  if (profile.education && profile.education.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(pdfColors.text.primary);
    doc.text('Formation', 20, yPosition);
    yPosition += lineHeight;

    doc.setFontSize(12);
    doc.setTextColor(pdfColors.text.secondary);
    
    profile.education.forEach((edu) => {
      doc.text(edu.school_name, 20, yPosition);
      yPosition += lineHeight;
      
      doc.text(`${edu.degree}${edu.field_of_study ? ` - ${edu.field_of_study}` : ''}`, 25, yPosition);
      yPosition += lineHeight;
      
      if (edu.start_date || edu.end_date) {
        const dateText = `${edu.start_date || ''} - ${edu.end_date || 'Présent'}`;
        doc.text(dateText, 25, yPosition);
        yPosition += lineHeight * 1.5;
      }
    });
  }

  // Certifications section
  if (profile.certifications && profile.certifications.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(pdfColors.text.primary);
    doc.text('Certifications', 20, yPosition);
    yPosition += lineHeight;

    doc.setFontSize(12);
    doc.setTextColor(pdfColors.text.secondary);
    
    profile.certifications.forEach((cert) => {
      doc.text(cert.title, 20, yPosition);
      yPosition += lineHeight;
      
      doc.text(`${cert.issuer}${cert.year ? ` (${cert.year})` : ''}`, 25, yPosition);
      yPosition += lineHeight * 1.5;
    });
  }

  // QR Code
  try {
    const qrDataUrl = await QRCode.toDataURL(window.location.href);
    doc.addImage(qrDataUrl, 'PNG', 160, 20, 30, 30);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(pdfColors.text.muted);
  doc.text('Généré sur victaure.com', 20, 285);

  // Save the PDF
  const fileName = `${profile.full_name?.replace(/\s+/g, '_').toLowerCase() || 'vcard'}.pdf`;
  doc.save(fileName);
};