import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import type { UserProfile } from '@/types/profile';
import { pdfStyles } from './styles';
import { drawHeader } from '../helpers';
import type { ExtendedJsPDF } from '../types';
import { renderHeader } from './sections/header';
import { renderContactInfo } from './sections/contact';
import { renderSkills } from './sections/skills';
import { renderExperiences } from './sections/experiences';
import { renderEducation } from './sections/education';
import { renderCertifications } from './sections/certifications';

export const generateVCardPDF = async (profile: UserProfile, accentColor: string = '#1E40AF') => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  }) as ExtendedJsPDF;

  // Update styles with custom accent color
  const styles = {
    ...pdfStyles,
    colors: {
      ...pdfStyles.colors,
      primary: accentColor,
      secondary: accentColor + '80', // Add 80 for 50% opacity
      background: '#FFFFFF'
    }
  };

  // White background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, 'F');

  // Header with custom color
  const headerHeight = 50;
  drawHeader(doc, headerHeight, styles.colors.primary, styles.colors.secondary);

  let yPos = styles.margins.top + 15;

  // Render each section and update yPos
  yPos = await renderHeader(doc, profile, yPos);
  yPos = renderContactInfo(doc, profile, yPos);
  yPos = renderSkills(doc, profile.skills, yPos, styles);
  yPos = renderExperiences(doc, profile.experiences, yPos, styles);
  yPos = renderEducation(doc, profile.education, yPos, styles);
  yPos = renderCertifications(doc, profile.certifications, yPos, styles);

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

  // Footer
  const footerColor = styles.colors.primary + '1A'; // 1A = 10% opacity in hex
  doc.setFillColor(footerColor);
  doc.rect(0, 280, 210, 17, 'F');
  
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Créé sur victaure.com', 105, 285, { align: 'center' });

  // Save the PDF
  doc.save(`cv-${profile.full_name?.toLowerCase().replace(/\s+/g, '-') || 'professionnel'}.pdf`);
};

// Alias for backward compatibility
export const generateCVPDF = generateVCardPDF;