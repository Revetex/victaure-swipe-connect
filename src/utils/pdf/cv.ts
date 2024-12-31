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

  // Background avec un dégradé plus professionnel
  doc.setFillColor(pdfColors.background);
  doc.rect(0, 0, 210, 297, 'F');

  // Circuit pattern plus subtil
  doc.setDrawColor(pdfColors.circuit.lines);
  doc.setLineWidth(0.1);
  for (let i = 0; i < 210; i += 10) {
    doc.line(i, 0, i, 297);
  }
  for (let i = 0; i < 297; i += 10) {
    doc.line(0, i, 210, i);
  }

  // En-tête avec logo
  const logoImg = new Image();
  logoImg.src = '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png';
  doc.addImage(logoImg, 'PNG', 10, 10, 20, 20);

  // Information principale
  doc.setTextColor(pdfColors.text.primary);
  doc.setFontSize(24);
  doc.text(profile.full_name || 'Nom complet', 40, 25);

  doc.setFontSize(16);
  doc.setTextColor(pdfColors.text.secondary);
  doc.text(profile.role || 'Rôle', 40, 35);

  // Contact Info avec une meilleure organisation
  doc.setFontSize(12);
  doc.setTextColor(pdfColors.text.muted);
  let yPos = 50;
  if (profile.email) doc.text(profile.email, 40, yPos);
  if (profile.phone) doc.text(profile.phone, 40, yPos + 8);
  if (profile.city) {
    const location = [profile.city, profile.state, profile.country]
      .filter(Boolean)
      .join(', ');
    doc.text(location, 40, yPos + 16);
  }

  // Bio avec un style amélioré
  if (profile.bio) {
    yPos += 35;
    doc.setFontSize(14);
    doc.setTextColor(pdfColors.text.primary);
    doc.text('À propos', 40, yPos);
    doc.setFontSize(12);
    doc.setTextColor(pdfColors.text.secondary);
    const bioLines = doc.splitTextToSize(profile.bio, 130);
    doc.text(bioLines, 40, yPos + 10);
    yPos += 10 + (bioLines.length * 6);
  }

  // Compétences avec une présentation plus claire
  if (profile.skills && profile.skills.length > 0) {
    yPos += 15;
    doc.setFontSize(14);
    doc.setTextColor(pdfColors.text.primary);
    doc.text('Compétences', 40, yPos);
    doc.setFontSize(12);
    doc.setTextColor(pdfColors.text.secondary);
    const skillsText = profile.skills.join(' • ');
    const skillsLines = doc.splitTextToSize(skillsText, 130);
    doc.text(skillsLines, 40, yPos + 10);
    yPos += 10 + (skillsLines.length * 6);
  }

  // Expérience avec une meilleure mise en page
  if (profile.experiences && profile.experiences.length > 0) {
    yPos += 15;
    doc.setFontSize(14);
    doc.setTextColor(pdfColors.text.primary);
    doc.text('Expérience professionnelle', 40, yPos);
    doc.setFontSize(12);
    
    profile.experiences.forEach((exp: any) => {
      yPos += 10;
      doc.setTextColor(pdfColors.text.primary);
      doc.text(`${exp.position} - ${exp.company}`, 40, yPos);
      if (exp.start_date) {
        doc.setTextColor(pdfColors.text.muted);
        const dateText = exp.end_date 
          ? `${new Date(exp.start_date).getFullYear()} - ${new Date(exp.end_date).getFullYear()}`
          : `${new Date(exp.start_date).getFullYear()} - Présent`;
        doc.text(dateText, 40, yPos + 6);
      }
      if (exp.description) {
        doc.setTextColor(pdfColors.text.secondary);
        const descLines = doc.splitTextToSize(exp.description, 130);
        doc.text(descLines, 40, yPos + 12);
        yPos += 12 + (descLines.length * 6);
      }
      yPos += 8;
    });
  }

  // Formation avec un style cohérent
  if (profile.education && profile.education.length > 0) {
    yPos += 15;
    doc.setFontSize(14);
    doc.setTextColor(pdfColors.text.primary);
    doc.text('Formation', 40, yPos);
    doc.setFontSize(12);
    
    profile.education.forEach((edu: any) => {
      yPos += 10;
      doc.setTextColor(pdfColors.text.primary);
      doc.text(`${edu.degree} - ${edu.school_name}`, 40, yPos);
      if (edu.start_date) {
        doc.setTextColor(pdfColors.text.muted);
        const dateText = edu.end_date 
          ? `${new Date(edu.start_date).getFullYear()} - ${new Date(edu.end_date).getFullYear()}`
          : `${new Date(edu.start_date).getFullYear()} - Présent`;
        doc.text(dateText, 40, yPos + 6);
      }
      if (edu.description) {
        doc.setTextColor(pdfColors.text.secondary);
        const descLines = doc.splitTextToSize(edu.description, 130);
        doc.text(descLines, 40, yPos + 12);
        yPos += 12 + (descLines.length * 6);
      }
      yPos += 8;
    });
  }

  // QR Code
  try {
    const qrDataUrl = await QRCode.toDataURL(window.location.href);
    doc.addImage(qrDataUrl, 'PNG', 170, 20, 30, 30);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(pdfColors.text.muted);
  doc.text('Créé sur victaure.com', 105, 285, { align: 'center' });

  doc.save('cv.pdf');
};