import jsPDF from 'jspdf';
import type { UserProfile } from '@/types/profile';
import { pdfStyles } from './styles';
import type { ExtendedJsPDF } from '@/types/pdf';
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
    // Initialize PDF document with A4 size
    const baseDoc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add custom methods to the document
    const doc = baseDoc as unknown as ExtendedJsPDF;
    doc.setGlobalAlpha = function(alpha: number) {
      // @ts-ignore - This is a valid internal method
      this.internal.write(alpha + " g");
    };
    doc.roundedRect = function(x: number, y: number, w: number, h: number, rx: number, ry: number, style: string) {
      const r = rx;
      const k = this.internal.scaleFactor;
      const hp = this.internal.pageSize.getHeight();
      
      y = hp - y - h;
      
      this.setLineWidth(0.5);
      
      const c = 0.551915024494;
      
      this.lines(
        [
          [w - 2 * r, 0],
          [r * c, 0, r, 0, r, -r],
          [0, -(h - 2 * r)],
          [0, -r * c, -r, -r, -r, -r],
          [-(w - 2 * r), 0],
          [-r * c, 0, -r, 0, -r, r],
          [0, h - 2 * r],
          [0, r * c, r, r, r, r]
        ],
        x + r,
        y + h - r,
        [1, 1],
        style
      );
      
      return this;
    };

    // Set document properties
    doc.setProperties({
      title: `CV - ${profile.full_name || 'No Name'}`,
      subject: 'Curriculum Vitae',
      author: profile.full_name || 'Unknown',
      keywords: 'cv, resume, curriculum vitae',
      creator: 'Victaure CV Generator'
    });

    // Set initial position
    let yPos = pdfStyles.margins.top;

    // Set document styles
    doc.setFont('helvetica');
    doc.setFontSize(pdfStyles.fonts.body.size);
    doc.setTextColor(pdfStyles.colors.text.primary);

    // Add white background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');

    // Add gradient header background
    const gradientSteps = 15;
    for (let i = 0; i < gradientSteps; i++) {
      const opacity = 0.1 - (i / gradientSteps) * 0.08;
      doc.setGlobalAlpha(opacity);
      doc.setFillColor(accentColor);
      doc.rect(0, (i * 50) / gradientSteps, 210, 50 / gradientSteps, 'F');
    }
    doc.setGlobalAlpha(1);

    // Render sections
    yPos = await renderHeader(doc, profile, yPos);
    yPos = renderContact(doc, profile, yPos + 10);
    
    if (profile.bio) {
      yPos = renderBio(doc, profile, yPos + 10);
    }
    
    if (profile.skills && profile.skills.length > 0) {
      yPos = renderSkills(doc, profile, yPos + 10);
    }
    
    if (profile.experiences && profile.experiences.length > 0) {
      yPos = renderExperiences(doc, profile, yPos + 10);
    }
    
    if (profile.education && profile.education.length > 0) {
      yPos = renderEducation(doc, profile, yPos + 10);
    }

    // Add footer with QR code
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