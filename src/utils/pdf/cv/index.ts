import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { StyleOption } from "@/components/vcard/types";
import { renderHeader } from './sections/header';
import { renderBio } from './sections/bio';
import { renderContact } from './sections/contact';
import { renderSkills } from './sections/skills';
import { renderExperiences } from './sections/experiences';
import { renderEducation } from './sections/education';
import { renderCertifications } from './sections/certifications';
import { renderFooter } from './sections/footer';

export const generateCV = async (
  profile: UserProfile,
  selectedStyle: StyleOption
): Promise<ExtendedJsPDF> => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    }) as ExtendedJsPDF;

    // Set font family based on style
    const fontFamily = selectedStyle?.font || 'helvetica';
    doc.setFont(fontFamily);

    let currentY = 20;

    // Header with profile info
    currentY = await renderHeader(doc, profile, currentY, selectedStyle);
    currentY += 10;

    // Contact information
    currentY = renderContact(doc, profile, currentY, selectedStyle);
    currentY += 10;

    // Bio section if available
    if (profile.bio) {
      currentY = renderBio(doc, profile, currentY, selectedStyle);
      currentY += 10;
    }

    // Skills section
    if (profile.skills && profile.skills.length > 0) {
      currentY = renderSkills(doc, profile, currentY, selectedStyle);
      currentY += 10;
    }

    // Experience section
    if (profile.experiences && profile.experiences.length > 0) {
      currentY = renderExperiences(doc, profile, currentY, selectedStyle);
      currentY += 10;
    }

    // Education section
    if (profile.education && profile.education.length > 0) {
      currentY = renderEducation(doc, profile, currentY, selectedStyle);
      currentY += 10;
    }

    // Certifications section
    if (profile.certifications && profile.certifications.length > 0) {
      currentY = renderCertifications(doc, profile.certifications, currentY, selectedStyle);
      currentY += 10;
    }

    // Footer with QR code and branding
    await renderFooter(doc, selectedStyle);

    return doc;
  } catch (error) {
    console.error('Error generating CV:', error);
    throw error;
  }
};