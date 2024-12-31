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

  // Add gradient effect
  for (let i = 0; i < 210; i += 2) {
    const shade = Math.floor((i / 210) * 15);
    doc.setFillColor(`#${(parseInt(pdfColors.background.slice(1), 16) + shade).toString(16).padStart(6, '0')}`);
    doc.rect(i, 0, 2, 297, 'F');
  }

  // Decorative header bar
  doc.setFillColor(pdfColors.primary);
  doc.rect(0, 0, 210, 40, 'F');

  let yPos = 25;

  // Header with name and role
  doc.setTextColor(pdfColors.text.primary);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(profile.full_name || '', 20, yPos);

  yPos += 8;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  if (profile.role) {
    doc.text(profile.role, 20, yPos);
    yPos += 8;
  }

  // Contact Information
  doc.setFontSize(10);
  doc.setTextColor(pdfColors.text.secondary);
  if (profile.email) {
    doc.text(`Email: ${profile.email}`, 20, yPos);
    yPos += 5;
  }
  if (profile.phone) {
    doc.text(`Téléphone: ${profile.phone}`, 20, yPos);
    yPos += 5;
  }
  if (profile.city) {
    const location = [profile.city, profile.state, profile.country].filter(Boolean).join(', ');
    doc.text(`Localisation: ${location}`, 20, yPos);
    yPos += 15;
  }

  // Bio
  if (profile.bio) {
    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(pdfColors.text.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('À propos', 20, yPos);
    yPos += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(pdfColors.text.secondary);
    const bioLines = doc.splitTextToSize(profile.bio, 170);
    doc.text(bioLines, 20, yPos);
    yPos += (bioLines.length * 5) + 10;
  }

  // Skills
  if (profile.skills && profile.skills.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(pdfColors.text.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('Compétences', 20, yPos);
    yPos += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(pdfColors.text.secondary);
    const skillsText = profile.skills.join(' • ');
    const skillsLines = doc.splitTextToSize(skillsText, 170);
    doc.text(skillsLines, 20, yPos);
    yPos += (skillsLines.length * 5) + 15;
  }

  // Experience
  if (profile.experiences && profile.experiences.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(pdfColors.text.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('Expérience professionnelle', 20, yPos);
    yPos += 10;

    profile.experiences.forEach((exp) => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${exp.position} - ${exp.company}`, 20, yPos);
      yPos += 6;

      if (exp.start_date) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(pdfColors.text.muted);
        const dateText = exp.end_date 
          ? `${new Date(exp.start_date).toLocaleDateString('fr-FR')} - ${new Date(exp.end_date).toLocaleDateString('fr-FR')}`
          : `${new Date(exp.start_date).toLocaleDateString('fr-FR')} - Présent`;
        doc.text(dateText, 20, yPos);
        yPos += 6;
      }

      if (exp.description) {
        doc.setFontSize(10);
        doc.setTextColor(pdfColors.text.secondary);
        const descLines = doc.splitTextToSize(exp.description, 170);
        doc.text(descLines, 20, yPos);
        yPos += (descLines.length * 5) + 8;
      }
    });
  }

  // Education
  if (profile.education && profile.education.length > 0) {
    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(pdfColors.text.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('Formation', 20, yPos);
    yPos += 10;

    profile.education.forEach((edu) => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${edu.degree}${edu.field_of_study ? ` - ${edu.field_of_study}` : ''}`, 20, yPos);
      yPos += 6;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(edu.school_name, 20, yPos);
      yPos += 6;

      if (edu.start_date) {
        doc.setTextColor(pdfColors.text.muted);
        const dateText = edu.end_date 
          ? `${new Date(edu.start_date).toLocaleDateString('fr-FR')} - ${new Date(edu.end_date).toLocaleDateString('fr-FR')}`
          : `${new Date(edu.start_date).toLocaleDateString('fr-FR')} - Présent`;
        doc.text(dateText, 20, yPos);
        yPos += 6;
      }

      if (edu.description) {
        doc.setTextColor(pdfColors.text.secondary);
        const descLines = doc.splitTextToSize(edu.description, 170);
        doc.text(descLines, 20, yPos);
        yPos += (descLines.length * 5) + 8;
      }
    });
  }

  // QR Code at the bottom
  try {
    const qrDataUrl = await QRCode.toDataURL(window.location.href, {
      margin: 0,
      width: 256,
      color: {
        dark: pdfColors.text.primary.slice(1),
        light: '#0000'
      }
    });
    doc.addImage(qrDataUrl, 'PNG', 170, 260, 30, 30);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(pdfColors.text.muted);
  doc.text('Créé sur victaure.com', 105, 285, { align: 'center' });

  // Save the PDF
  doc.save(`cv-${profile.full_name?.toLowerCase().replace(/\s+/g, '-') || 'professionnel'}.pdf`);
};