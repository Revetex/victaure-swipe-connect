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
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    }) as ExtendedJsPDF;

    // Set gradient background using multiple rectangles with varying opacity
    const gradientSteps = 15;
    for (let i = 0; i < gradientSteps; i++) {
      const alpha = 0.03 - (i / gradientSteps) * 0.02;
      doc.setFillColor(accentColor);
      doc.setGlobalAlpha(alpha);
      doc.rect(0, (i * 297) / gradientSteps, 210, 297 / gradientSteps, 'F');
    }

    // Reset opacity for content
    doc.setGlobalAlpha(1);

    // Add a subtle white overlay for better readability
    doc.setFillColor(255, 255, 255);
    doc.setGlobalAlpha(0.95);
    doc.rect(15, 15, 180, 267, 'F');
    doc.setGlobalAlpha(1);

    // Add decorative elements
    doc.setDrawColor(accentColor);
    doc.setLineWidth(0.5);
    doc.setLineDashPattern([1, 1], 0);
    doc.line(15, 20, 195, 20);
    doc.line(15, 277, 195, 277);

    // Add subtle corner decorations
    const cornerSize = 5;
    doc.setLineWidth(0.3);
    // Top left
    doc.line(15, 15, 15 + cornerSize, 15);
    doc.line(15, 15, 15, 15 + cornerSize);
    // Top right
    doc.line(195 - cornerSize, 15, 195, 15);
    doc.line(195, 15, 195, 15 + cornerSize);
    // Bottom left
    doc.line(15, 277, 15 + cornerSize, 277);
    doc.line(15, 277 - cornerSize, 15, 277);
    // Bottom right
    doc.line(195 - cornerSize, 277, 195, 277);
    doc.line(195, 277 - cornerSize, 195, 277);

    // Render each section and update yPos
    let yPos = pdfStyles.margins.top + 15;
    
    yPos = await renderHeader(doc, profile, yPos);
    yPos = renderContact(doc, profile, yPos);
    yPos = renderBio(doc, profile, yPos);
    yPos = renderSkills(doc, profile, yPos);
    yPos = renderExperiences(doc, profile, yPos);
    yPos = renderEducation(doc, profile, yPos);
    await renderFooter(doc, accentColor);

    // Save the PDF with a clean filename
    const cleanName = profile.full_name?.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'vcard';
    doc.save(`${cleanName}_vcard.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

// Alias for backward compatibility
export const generateCVPDF = generateVCardPDF;