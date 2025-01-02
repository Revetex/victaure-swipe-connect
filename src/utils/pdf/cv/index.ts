import jsPDF from 'jspdf';
import type { UserProfile } from '@/types/profile';
import { pdfStyles } from './styles';
import { drawHeader } from '../helpers';
import type { ExtendedJsPDF } from '../types';
import { renderHeader } from './sections/header';
import { renderContact } from './sections/contact';
import { renderBio } from './sections/bio';
import { renderSkills } from './sections/skills';
import { renderExperiences } from './sections/experiences';
import { renderEducation } from './sections/education';
import { renderFooter } from './sections/footer';

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
  yPos = renderContact(doc, profile, yPos);
  yPos = renderBio(doc, profile, yPos);
  yPos = renderSkills(doc, profile, yPos);
  yPos = renderExperiences(doc, profile, yPos);
  yPos = renderEducation(doc, profile, yPos);
  await renderFooter(doc, accentColor);

  // Save the PDF
  doc.save(`cv-${profile.full_name?.toLowerCase().replace(/\s+/g, '-') || 'professionnel'}.pdf`);
};

// Alias for backward compatibility
export const generateCVPDF = generateVCardPDF;