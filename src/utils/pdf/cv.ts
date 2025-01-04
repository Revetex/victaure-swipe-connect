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
  if (!profile) {
    throw new Error('No profile data provided');
  }

  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    }) as unknown as ExtendedJsPDF;

    // Set gradient background
    const gradientSteps = 15;
    for (let i = 0; i < gradientSteps; i++) {
      const opacity = 0.03 - (i / gradientSteps) * 0.02;
      const alpha = Math.floor(opacity * 255);
      const hexOpacity = alpha.toString(16).padStart(2, '0');
      doc.setFillColor(accentColor + hexOpacity);
      doc.rect(0, (i * 297) / gradientSteps, 210, 297 / gradientSteps, 'F');
    }

    // Add sections
    let yPos = pdfStyles.margins.top;
    yPos = await renderHeader(doc, profile, yPos);
    yPos = renderContact(doc, profile, yPos);
    yPos = renderBio(doc, profile, yPos);
    yPos = renderSkills(doc, profile, yPos);
    yPos = renderExperiences(doc, profile, yPos);
    yPos = renderEducation(doc, profile, yPos);
    await renderFooter(doc, accentColor);

    // Save the PDF
    const cleanName = profile.full_name?.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'vcard';
    doc.save(`${cleanName}_vcard.pdf`);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF: ' + (error as Error).message);
  }
};

// Alias for backward compatibility
export const generateCVPDF = generateVCardPDF;
