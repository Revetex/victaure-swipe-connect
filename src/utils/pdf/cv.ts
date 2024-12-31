import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { pdfColors } from './colors';
import type { UserProfile } from '@/types/profile';

export const generateCVPDF = async (profile: UserProfile) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Background
  doc.setFillColor(pdfColors.background);
  doc.rect(0, 0, 210, 297, 'F');

  // Header with logo
  const logoImg = new Image();
  logoImg.src = '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png';
  doc.addImage(logoImg, 'PNG', 10, 10, 20, 20);

  let yPos = 20;

  // Personal Information
  doc.setTextColor(pdfColors.text.primary);
  doc.setFontSize(24);
  doc.text(profile.full_name || '', 40, yPos);

  yPos += 10;
  doc.setFontSize(16);
  doc.setTextColor(pdfColors.text.secondary);
  if (profile.role) {
    doc.text(profile.role, 40, yPos);
    yPos += 10;
  }

  // Contact Information
  doc.setFontSize(12);
  doc.setTextColor(pdfColors.text.muted);
  if (profile.email) {
    doc.text(`Email: ${profile.email}`, 40, yPos);
    yPos += 7;
  }
  if (profile.phone) {
    doc.text(`Téléphone: ${profile.phone}`, 40, yPos);
    yPos += 7;
  }
  if (profile.city) {
    const location = [profile.city, profile.state, profile.country].filter(Boolean).join(', ');
    doc.text(`Localisation: ${location}`, 40, yPos);
    yPos += 15;
  }

  // Bio
  if (profile.bio) {
    doc.setFontSize(14);
    doc.setTextColor(pdfColors.text.primary);
    doc.text('À propos', 40, yPos);
    yPos += 7;
    doc.setFontSize(12);
    doc.setTextColor(pdfColors.text.secondary);
    const bioLines = doc.splitTextToSize(profile.bio, 130);
    doc.text(bioLines, 40, yPos);
    yPos += (bioLines.length * 7) + 10;
  }

  // Skills
  if (profile.skills && profile.skills.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(pdfColors.text.primary);
    doc.text('Compétences', 40, yPos);
    yPos += 7;
    doc.setFontSize(12);
    doc.setTextColor(pdfColors.text.secondary);
    const skillsText = profile.skills.join(' • ');
    const skillsLines = doc.splitTextToSize(skillsText, 130);
    doc.text(skillsLines, 40, yPos);
    yPos += (skillsLines.length * 7) + 10;
  }

  // Experience
  if (profile.experiences && profile.experiences.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(pdfColors.text.primary);
    doc.text('Expérience professionnelle', 40, yPos);
    yPos += 10;

    profile.experiences.forEach((exp) => {
      doc.setFontSize(12);
      doc.setTextColor(pdfColors.text.primary);
      doc.text(`${exp.position} - ${exp.company}`, 40, yPos);
      yPos += 7;

      if (exp.start_date) {
        doc.setTextColor(pdfColors.text.muted);
        const dateText = exp.end_date 
          ? `${new Date(exp.start_date).toLocaleDateString('fr-FR')} - ${new Date(exp.end_date).toLocaleDateString('fr-FR')}`
          : `${new Date(exp.start_date).toLocaleDateString('fr-FR')} - Présent`;
        doc.text(dateText, 40, yPos);
        yPos += 7;
      }

      if (exp.description) {
        doc.setTextColor(pdfColors.text.secondary);
        const descLines = doc.splitTextToSize(exp.description, 130);
        doc.text(descLines, 40, yPos);
        yPos += (descLines.length * 7) + 5;
      }
    });
    yPos += 5;
  }

  // Education
  if (profile.education && profile.education.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(pdfColors.text.primary);
    doc.text('Formation', 40, yPos);
    yPos += 10;

    profile.education.forEach((edu) => {
      doc.setFontSize(12);
      doc.setTextColor(pdfColors.text.primary);
      doc.text(`${edu.degree} - ${edu.school_name}`, 40, yPos);
      yPos += 7;

      if (edu.start_date) {
        doc.setTextColor(pdfColors.text.muted);
        const dateText = edu.end_date 
          ? `${new Date(edu.start_date).toLocaleDateString('fr-FR')} - ${new Date(edu.end_date).toLocaleDateString('fr-FR')}`
          : `${new Date(edu.start_date).toLocaleDateString('fr-FR')} - Présent`;
        doc.text(dateText, 40, yPos);
        yPos += 7;
      }

      if (edu.description) {
        doc.setTextColor(pdfColors.text.secondary);
        const descLines = doc.splitTextToSize(edu.description, 130);
        doc.text(descLines, 40, yPos);
        yPos += (descLines.length * 7) + 5;
      }
    });
  }

  // QR Code at the bottom
  try {
    const qrDataUrl = await QRCode.toDataURL(window.location.href);
    doc.addImage(qrDataUrl, 'PNG', 170, 260, 30, 30);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(pdfColors.text.muted);
  doc.text('Créé sur victaure.com', 105, 285, { align: 'center' });

  doc.save(`cv-${profile.full_name?.toLowerCase().replace(/\s+/g, '-') || 'professionnel'}.pdf`);
};