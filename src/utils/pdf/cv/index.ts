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

  // Mise à jour des styles avec la couleur d'accent personnalisée
  const styles = {
    ...pdfStyles,
    colors: {
      ...pdfStyles.colors,
      primary: accentColor,
      secondary: accentColor + '80', // Ajouter 80 pour 50% d'opacité
      background: '#FFFFFF'
    }
  };

  // Fond blanc pour s'assurer que le contenu est visible
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, 'F');

  // En-tête avec la couleur personnalisée
  const headerHeight = 50;
  drawHeader(doc, headerHeight, styles.colors.primary, styles.colors.secondary);

  let yPos = styles.margins.top + 15;

  // Rendu de l'en-tête
  yPos = await renderHeader(doc, profile, yPos);

  // Rendu des informations de contact
  yPos = renderContactInfo(doc, profile, yPos);

  // Section bio si elle existe
  if (profile.bio) {
    yPos += 10;
    drawSection(doc, yPos, 180, 30, styles.colors.primary);

    doc.setFontSize(styles.fonts.subheader.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0); // Noir pour le texte
    doc.text('À propos', styles.margins.left, yPos);
    
    yPos += 8;
    doc.setFontSize(styles.fonts.body.size);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51); // Gris foncé pour le texte
    const bioLines = doc.splitTextToSize(profile.bio, 170);
    doc.text(bioLines, styles.margins.left, yPos);
    yPos += (bioLines.length * 5) + 15;
  }

  // Section compétences
  if (profile.skills && profile.skills.length > 0) {
    drawSection(doc, yPos, 180, 20, styles.colors.accent);

    doc.setFontSize(styles.fonts.subheader.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Compétences', styles.margins.left, yPos);
    
    yPos += 8;
    doc.setFontSize(styles.fonts.body.size);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    
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

  // Section expérience
  if (profile.experiences && profile.experiences.length > 0) {
    doc.setFontSize(styles.fonts.subheader.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
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
        doc.setTextColor(128, 128, 128);
        const dateText = exp.end_date 
          ? `${new Date(exp.start_date).toLocaleDateString('fr-FR')} - ${new Date(exp.end_date).toLocaleDateString('fr-FR')}`
          : `${new Date(exp.start_date).toLocaleDateString('fr-FR')} - Présent`;
        doc.text(dateText, styles.margins.left + 2, yPos);
        yPos += 6;
      }

      if (exp.description) {
        doc.setTextColor(51, 51, 51);
        const descLines = doc.splitTextToSize(exp.description, 165);
        doc.text(descLines, styles.margins.left + 2, yPos);
        yPos += (descLines.length * 5) + 10;
      }
    });
  }

  // QR Code
  try {
    const qrDataUrl = await QRCode.toDataURL(window.location.href, {
      margin: 0,
      width: 256,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    doc.addImage(qrDataUrl, 'PNG', 170, 260, 30, 30);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  // Pied de page
  const footerColor = styles.colors.primary + '1A'; // 1A = 10% opacité en hex
  doc.setFillColor(footerColor);
  doc.rect(0, 280, 210, 17, 'F');
  
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Créé sur victaure.com', 105, 285, { align: 'center' });

  // Sauvegarde du PDF
  doc.save(`cv-${profile.full_name?.toLowerCase().replace(/\s+/g, '-') || 'professionnel'}.pdf`);
};

// Alias pour la rétrocompatibilité
export const generateCVPDF = generateVCardPDF;