import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { pdfColors } from './colors';
import type { UserProfile } from '@/types/profile';

export const generateVCardPDF = async (profile: UserProfile) => {
  // Initialize PDF
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Set white background explicitly
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, 'F');

  // Header with profile photo
  if (profile.avatar_url) {
    try {
      const img = new Image();
      img.crossOrigin = 'Anonymous';  // Enable CORS
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = profile.avatar_url;
      });
      doc.addImage(img, 'PNG', 20, 20, 40, 40, undefined, 'FAST');
      // Add a subtle border around the image
      doc.setDrawColor(200, 200, 200);
      doc.rect(20, 20, 40, 40, 'S');
    } catch (error) {
      console.error('Error adding profile image:', error);
    }
  }

  // QR Code (top right corner)
  try {
    const qrDataUrl = await QRCode.toDataURL(window.location.href);
    doc.addImage(qrDataUrl, 'PNG', 160, 20, 30, 30);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  // Name and Role
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0); // Black text
  doc.text(profile.full_name || 'Nom complet', 70, 35);

  doc.setFontSize(16);
  doc.setTextColor(80, 80, 80); // Dark gray text
  doc.text(profile.role || 'Rôle professionnel', 70, 45);

  // Contact Information
  let yPosition = 80;
  const lineHeight = 8;

  // Contact section title
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Contact', 20, yPosition);
  yPosition += lineHeight * 1.5;

  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);

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

  // Bio section
  if (profile.bio) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('À propos', 20, yPosition);
    yPosition += lineHeight;

    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    const bioLines = doc.splitTextToSize(profile.bio, 170);
    doc.text(bioLines, 20, yPosition);
    yPosition += (bioLines.length * lineHeight) + lineHeight;
  }

  // Skills section
  if (profile.skills && profile.skills.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Compétences', 20, yPosition);
    yPosition += lineHeight;

    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    const skillsText = profile.skills.join(' • ');
    const skillsLines = doc.splitTextToSize(skillsText, 170);
    doc.text(skillsLines, 20, yPosition);
    yPosition += (skillsLines.length * lineHeight) + lineHeight;
  }

  // Experience section
  if (profile.experiences && profile.experiences.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Expériences professionnelles', 20, yPosition);
    yPosition += lineHeight * 1.5;

    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    
    profile.experiences.forEach((exp) => {
      doc.setFont(undefined, 'bold');
      doc.text(exp.position, 20, yPosition);
      yPosition += lineHeight;
      
      doc.setFont(undefined, 'normal');
      doc.text(exp.company, 20, yPosition);
      yPosition += lineHeight;
      
      if (exp.start_date || exp.end_date) {
        const dateText = `${exp.start_date ? new Date(exp.start_date).toLocaleDateString() : ''} - ${exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Présent'}`;
        doc.text(dateText, 20, yPosition);
        yPosition += lineHeight;
      }

      if (exp.description) {
        const descLines = doc.splitTextToSize(exp.description, 170);
        doc.text(descLines, 20, yPosition);
        yPosition += (descLines.length * lineHeight) + lineHeight;
      }

      yPosition += lineHeight;
    });
  }

  // Education section
  if (profile.education && profile.education.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Formation', 20, yPosition);
    yPosition += lineHeight * 1.5;

    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    
    profile.education.forEach((edu) => {
      doc.setFont(undefined, 'bold');
      doc.text(edu.school_name, 20, yPosition);
      yPosition += lineHeight;
      
      doc.setFont(undefined, 'normal');
      doc.text(`${edu.degree}${edu.field_of_study ? ` - ${edu.field_of_study}` : ''}`, 20, yPosition);
      yPosition += lineHeight;
      
      if (edu.start_date || edu.end_date) {
        const dateText = `${edu.start_date || ''} - ${edu.end_date || 'Présent'}`;
        doc.text(dateText, 20, yPosition);
        yPosition += lineHeight * 1.5;
      }
    });
  }

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text('Généré sur victaure.com', 20, 285);

  // Save the PDF
  const fileName = `${profile.full_name?.replace(/\s+/g, '_').toLowerCase() || 'vcard'}.pdf`;
  doc.save(fileName);
};