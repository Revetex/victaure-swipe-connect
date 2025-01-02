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

  // White background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, 'F');

  // Render each section and update yPos
  let yPos = pdfStyles.margins.top + 15;
  
  yPos = await renderHeader(doc, profile, yPos, accentColor);
  yPos = renderContact(doc, profile, yPos);
  yPos = renderBio(doc, profile, yPos, accentColor);
  yPos = renderSkills(doc, profile, yPos, accentColor);
  yPos = renderExperiences(doc, profile, yPos);
  yPos = renderEducation(doc, profile, yPos, accentColor);
  await renderFooter(doc, accentColor);

  // Save the PDF
  doc.save(`cv-${profile.full_name?.toLowerCase().replace(/\s+/g, '-') || 'professionnel'}.pdf`);
};

// Alias for backward compatibility
export const generateCVPDF = generateVCardPDF;