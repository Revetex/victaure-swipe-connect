import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import type { UserProfile } from '@/types/profile';
import { pdfStyles } from './styles';
import { drawHeader, drawSection, drawTimeline, drawTimelineDot } from '../helpers';
import type { ExtendedJsPDF } from '../types';
import { renderHeader } from './sections/header';
import { renderContactInfo } from './sections/contact';

export const generateVCardPDF = async (profile: UserProfile, accentColor: string = '#9b87f5') => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  }) as ExtendedJsPDF;

  // Add gradient background
  doc.setFillColor(pdfStyles.colors.background);
  doc.rect(0, 0, 210, 297, 'F');

  // Add header with custom color
  const headerHeight = 50;
  drawHeader(doc, headerHeight, accentColor, pdfStyles.colors.secondary);

  let yPos = pdfStyles.margins.top + 15;

  // Render header section
  yPos = await renderHeader(doc, profile, yPos);

  // Render contact information
  yPos = renderContactInfo(doc, profile, yPos);

  // Add bio section
  if (profile.bio) {
    yPos += 10;
    drawSection(doc, yPos, 180, 30, accentColor);

    doc.setFontSize(pdfStyles.fonts.subheader.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(pdfStyles.colors.text.primary);
    doc.text('À propos', pdfStyles.margins.left, yPos);
    
    yPos += 8;
    doc.setFontSize(pdfStyles.fonts.body.size);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(pdfStyles.colors.text.secondary);
    const bioLines = doc.splitTextToSize(profile.bio, 170);
    doc.text(bioLines, pdfStyles.margins.left, yPos);
    yPos += (bioLines.length * 5) + 15;
  }

  // Add skills section
  if (profile.skills && profile.skills.length > 0) {
    drawSection(doc, yPos, 180, 20, pdfStyles.colors.accent);

    doc.setFontSize(pdfStyles.fonts.subheader.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(pdfStyles.colors.text.primary);
    doc.text('Compétences', pdfStyles.margins.left, yPos);
    
    yPos += 8;
    doc.setFontSize(pdfStyles.fonts.body.size);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(pdfStyles.colors.text.secondary);
    
    const skillsPerRow = 4;
    const skillChunks = [];
    for (let i = 0; i < profile.skills.length; i += skillsPerRow) {
      skillChunks.push(profile.skills.slice(i, i + skillsPerRow));
    }

    skillChunks.forEach(chunk => {
      const skillsText = chunk.join(' • ');
      doc.text(skillsText, pdfStyles.margins.left, yPos);
      yPos += 6;
    });
    yPos += 10;
  }

  // Add experience section
  if (profile.experiences && profile.experiences.length > 0) {
    doc.setFontSize(pdfStyles.fonts.subheader.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(pdfStyles.colors.text.primary);
    doc.text('Expérience professionnelle', pdfStyles.margins.left, yPos);
    yPos += 8;

    profile.experiences.forEach((exp, index) => {
      drawTimelineDot(doc, pdfStyles.margins.left - 2, yPos - 2, pdfStyles.colors.primary);
      
      if (index < profile.experiences!.length - 1) {
        drawTimeline(doc, yPos, yPos + 20, pdfStyles.margins.left - 2, pdfStyles.colors.primary);
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${exp.position} - ${exp.company}`, pdfStyles.margins.left + 2, yPos);
      yPos += 6;

      if (exp.start_date) {
        doc.setFontSize(pdfStyles.fonts.body.size);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(pdfStyles.colors.text.muted);
        const dateText = exp.end_date 
          ? `${new Date(exp.start_date).toLocaleDateString('fr-FR')} - ${new Date(exp.end_date).toLocaleDateString('fr-FR')}`
          : `${new Date(exp.start_date).toLocaleDateString('fr-FR')} - Présent`;
        doc.text(dateText, pdfStyles.margins.left + 2, yPos);
        yPos += 6;
      }

      if (exp.description) {
        doc.setTextColor(pdfStyles.colors.text.secondary);
        const descLines = doc.splitTextToSize(exp.description, 165);
        doc.text(descLines, pdfStyles.margins.left + 2, yPos);
        yPos += (descLines.length * 5) + 10;
      }
    });
  }

  // Add education section
  if (profile.education && profile.education.length > 0) {
    yPos += 10;
    drawSection(doc, yPos, 180, 15 + (profile.education.length * 25), pdfStyles.colors.accent);

    doc.setFontSize(pdfStyles.fonts.subheader.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(pdfStyles.colors.text.primary);
    doc.text('Formation', pdfStyles.margins.left, yPos);
    yPos += 10;

    profile.education.forEach(edu => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${edu.degree}${edu.field_of_study ? ` - ${edu.field_of_study}` : ''}`, pdfStyles.margins.left, yPos);
      yPos += 6;
      
      doc.setFontSize(pdfStyles.fonts.body.size);
      doc.setFont('helvetica', 'normal');
      doc.text(edu.school_name, pdfStyles.margins.left, yPos);
      yPos += 6;

      if (edu.start_date) {
        doc.setTextColor(pdfStyles.colors.text.muted);
        const dateText = edu.end_date 
          ? `${new Date(edu.start_date).toLocaleDateString('fr-FR')} - ${new Date(edu.end_date).toLocaleDateString('fr-FR')}`
          : `${new Date(edu.start_date).toLocaleDateString('fr-FR')} - Présent`;
        doc.text(dateText, pdfStyles.margins.left, yPos);
        yPos += 6;
      }

      if (edu.description) {
        doc.setTextColor(pdfStyles.colors.text.secondary);
        const descLines = doc.splitTextToSize(edu.description, 165);
        doc.text(descLines, pdfStyles.margins.left, yPos);
        yPos += (descLines.length * 5) + 8;
      }
    });
  }

  // QR Code
  try {
    const qrDataUrl = await QRCode.toDataURL(window.location.href, {
      margin: 0,
      width: 256,
      color: {
        dark: pdfStyles.colors.text.primary.slice(1),
        light: '#0000'
      }
    });
    doc.addImage(qrDataUrl, 'PNG', 170, 260, 30, 30);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  // Footer with custom color
  const footerColor = accentColor + '1A'; // 1A = 10% opacity in hex
  doc.setFillColor(footerColor);
  doc.rect(0, 280, 210, 17, 'F');
  
  doc.setFontSize(8);
  doc.setTextColor(pdfStyles.colors.text.muted);
  doc.text('Créé sur victaure.com', 105, 285, { align: 'center' });

  // Save the PDF
  doc.save(`cv-${profile.full_name?.toLowerCase().replace(/\s+/g, '-') || 'professionnel'}.pdf`);
};

// Alias for backward compatibility
export const generateCVPDF = generateVCardPDF;
