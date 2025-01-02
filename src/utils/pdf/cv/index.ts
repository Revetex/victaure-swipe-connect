import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import type { UserProfile } from '@/types/profile';
import { pdfStyles } from './styles';
import { drawHeader, drawSection, drawTimeline, drawTimelineDot } from '../helpers';
import type { ExtendedJsPDF } from '../types';
import { renderHeader } from './sections/header';
import { renderContactInfo } from './sections/contact';

export const generateVCardPDF = async (profile: UserProfile, accentColor: string = '#1E40AF') => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  }) as ExtendedJsPDF;

  // Update styles with the custom accent color
  const styles = {
    ...pdfStyles,
    colors: {
      ...pdfStyles.colors,
      primary: accentColor,
      secondary: accentColor + '80', // Add 80 for 50% opacity
    }
  };

  // Add gradient background
  doc.setFillColor(styles.colors.background);
  doc.rect(0, 0, 210, 297, 'F');

  // Add header with custom color
  const headerHeight = 50;
  drawHeader(doc, headerHeight, styles.colors.primary, styles.colors.secondary);

  let yPos = styles.margins.top + 15;

  // Render header section
  yPos = await renderHeader(doc, profile, yPos);

  // Render contact information
  yPos = renderContactInfo(doc, profile, yPos);

  // Add bio section if exists
  if (profile.bio) {
    yPos += 10;
    drawSection(doc, yPos, 180, 30, styles.colors.primary);

    doc.setFontSize(styles.fonts.subheader.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(styles.colors.text.primary);
    doc.text('À propos', styles.margins.left, yPos);
    
    yPos += 8;
    doc.setFontSize(styles.fonts.body.size);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(styles.colors.text.secondary);
    const bioLines = doc.splitTextToSize(profile.bio, 170);
    doc.text(bioLines, styles.margins.left, yPos);
    yPos += (bioLines.length * 5) + 15;
  }

  // Add skills section
  if (profile.skills && profile.skills.length > 0) {
    drawSection(doc, yPos, 180, 20, styles.colors.accent);

    doc.setFontSize(styles.fonts.subheader.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(styles.colors.text.primary);
    doc.text('Compétences', styles.margins.left, yPos);
    
    yPos += 8;
    doc.setFontSize(styles.fonts.body.size);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(styles.colors.text.secondary);
    
    const skillsPerRow = 4;
    const skillChunks = [];
    for (let i = 0; i < profile.skills.length; i += skillsPerRow) {
      skillChunks.push(profile.skills.slice(i, i + skillsPerRow));
    }

    skillChunks.forEach(chunk => {
      const skillsText = chunk.join(' • ');
      doc.text(skillsText, styles.margins.left, yPos);
      yPos += 6;
    });
    yPos += 10;
  }

  // Add experience section
  if (profile.experiences && profile.experiences.length > 0) {
    doc.setFontSize(styles.fonts.subheader.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(styles.colors.text.primary);
    doc.text('Expérience professionnelle', styles.margins.left, yPos);
    yPos += 8;

    profile.experiences.forEach((exp, index) => {
      drawTimelineDot(doc, styles.margins.left - 2, yPos - 2, styles.colors.primary);
      
      if (index < profile.experiences!.length - 1) {
        drawTimeline(doc, yPos, yPos + 20, styles.margins.left - 2, styles.colors.primary);
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${exp.position} - ${exp.company}`, styles.margins.left + 2, yPos);
      yPos += 6;

      if (exp.start_date) {
        doc.setFontSize(styles.fonts.body.size);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(styles.colors.text.muted);
        const dateText = exp.end_date 
          ? `${new Date(exp.start_date).toLocaleDateString('fr-FR')} - ${new Date(exp.end_date).toLocaleDateString('fr-FR')}`
          : `${new Date(exp.start_date).toLocaleDateString('fr-FR')} - Présent`;
        doc.text(dateText, styles.margins.left + 2, yPos);
        yPos += 6;
      }

      if (exp.description) {
        doc.setTextColor(styles.colors.text.secondary);
        const descLines = doc.splitTextToSize(exp.description, 165);
        doc.text(descLines, styles.margins.left + 2, yPos);
        yPos += (descLines.length * 5) + 10;
      }
    });
  }

  // Add education section
  if (profile.education && profile.education.length > 0) {
    yPos += 10;
    drawSection(doc, yPos, 180, 15 + (profile.education.length * 25), styles.colors.accent);

    doc.setFontSize(styles.fonts.subheader.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(styles.colors.text.primary);
    doc.text('Formation', styles.margins.left, yPos);
    yPos += 10;

    profile.education.forEach(edu => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${edu.degree}${edu.field_of_study ? ` - ${edu.field_of_study}` : ''}`, styles.margins.left, yPos);
      yPos += 6;
      
      doc.setFontSize(styles.fonts.body.size);
      doc.setFont('helvetica', 'normal');
      doc.text(edu.school_name, styles.margins.left, yPos);
      yPos += 6;

      if (edu.start_date) {
        doc.setTextColor(styles.colors.text.muted);
        const dateText = edu.end_date 
          ? `${new Date(edu.start_date).toLocaleDateString('fr-FR')} - ${new Date(edu.end_date).toLocaleDateString('fr-FR')}`
          : `${new Date(edu.start_date).toLocaleDateString('fr-FR')} - Présent`;
        doc.text(dateText, styles.margins.left, yPos);
        yPos += 6;
      }

      if (edu.description) {
        doc.setTextColor(styles.colors.text.secondary);
        const descLines = doc.splitTextToSize(edu.description, 165);
        doc.text(descLines, styles.margins.left, yPos);
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
        dark: styles.colors.text.primary.slice(1),
        light: '#0000'
      }
    });
    doc.addImage(qrDataUrl, 'PNG', 170, 260, 30, 30);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  // Footer with custom color
  const footerColor = styles.colors.primary + '1A'; // 1A = 10% opacity in hex
  doc.setFillColor(footerColor);
  doc.rect(0, 280, 210, 17, 'F');
  
  doc.setFontSize(8);
  doc.setTextColor(styles.colors.text.muted);
  doc.text('Créé sur victaure.com', 105, 285, { align: 'center' });

  // Save the PDF
  doc.save(`cv-${profile.full_name?.toLowerCase().replace(/\s+/g, '-') || 'professionnel'}.pdf`);
};

// Alias for backward compatibility
export const generateCVPDF = generateVCardPDF;