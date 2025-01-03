import jsPDF from 'jspdf';
import type { UserProfile } from '@/types/profile';
import { pdfStyles } from './styles';
import type { ExtendedJsPDF } from './types';
import { renderHeader } from './cv/sections/header';
import { renderContact } from './cv/sections/contact';
import { renderBio } from './cv/sections/bio';
import { renderSkills } from './cv/sections/skills';
import { renderExperiences } from './cv/sections/experiences';
import { renderEducation } from './cv/sections/education';
import { renderFooter } from './cv/sections/footer';

export const generateVCardPDF = async (profile: UserProfile, accentColor: string = '#1E40AF') => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  }) as ExtendedJsPDF;

  // Set gradient background
  const gradient = doc.setFillColor(accentColor);
  doc.rect(0, 0, 210, 297, 'F');

  // Add a white overlay for better readability
  doc.setFillColor(255, 255, 255);
  doc.setGlobalAlpha(0.95);
  doc.rect(10, 10, 190, 277, 'F');
  doc.setGlobalAlpha(1);

  // Add decorative elements
  doc.setDrawColor(accentColor);
  doc.setLineWidth(0.5);
  doc.line(10, 15, 200, 15);
  doc.line(10, 282, 200, 282);

  // Render each section and update yPos
  let yPos = pdfStyles.margins.top + 15;
  
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