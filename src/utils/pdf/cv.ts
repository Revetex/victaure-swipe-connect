import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { StyleOption } from "@/components/vcard/types";
import { renderHeader } from "./cv/sections/header";
import { renderBio } from "./cv/sections/bio";
import { renderContact } from "./cv/sections/contact";
import { renderSkills } from "./cv/sections/skills";
import { renderExperiences } from "./cv/sections/experiences";
import { renderEducation } from "./cv/sections/education";
import { renderCertifications } from "./cv/sections/certifications";
import { renderFooter } from "./cv/sections/footer";
import { extendPdfDocument } from "./pdfExtensions";

export const generateCV = async (
  profile: UserProfile,
  selectedStyle: StyleOption
): Promise<ExtendedJsPDF> => {
  const doc = extendPdfDocument(new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  }));

  try {
    // Set initial styles based on selected theme
    doc.setFont("helvetica");
    doc.setTextColor(selectedStyle.colors.text.primary);

    let currentY = 20;

    // Add logo at the top
    try {
      const logoUrl = "/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png";
      doc.addImage(logoUrl, 'PNG', 20, currentY, 15, 15);
      currentY += 20;
    } catch (logoError) {
      console.error('Error adding logo to CV:', logoError);
      currentY += 5;
    }

    // Add subtle background pattern
    doc.setGlobalAlpha(0.03);
    for (let i = 0; i < doc.internal.pageSize.width; i += 10) {
      for (let j = 0; j < doc.internal.pageSize.height; j += 10) {
        doc.setFillColor(selectedStyle.colors.primary);
        doc.circle(i, j, 0.5, 'F');
      }
    }
    doc.setGlobalAlpha(1);

    // Header with profile info
    currentY = await renderHeader(doc, profile, currentY);
    currentY += 15;

    // Add decorative separator
    doc.setDrawColor(selectedStyle.colors.primary);
    doc.setLineWidth(0.5);
    doc.line(20, currentY - 5, doc.internal.pageSize.width - 20, currentY - 5);

    // Contact information
    currentY = renderContact(doc, profile, currentY);
    currentY += 15;

    // Bio section if available
    if (profile.bio) {
      currentY = renderBio(doc, profile, currentY);
      currentY += 15;
    }

    // Skills section with improved layout
    if (profile.skills && profile.skills.length > 0) {
      currentY = renderSkills(doc, profile, currentY);
      currentY += 15;
    }

    // Check if we need a new page
    if (currentY > doc.internal.pageSize.height - 50) {
      doc.addPage();
      currentY = 20;
    }

    // Education section (moved before experience for better flow)
    if (profile.education && profile.education.length > 0) {
      currentY = renderEducation(doc, profile, currentY);
      currentY += 15;
    }

    // Check if we need a new page
    if (currentY > doc.internal.pageSize.height - 50) {
      doc.addPage();
      currentY = 20;
    }

    // Experience section
    if (profile.experiences && profile.experiences.length > 0) {
      currentY = renderExperiences(doc, profile, currentY);
      currentY += 15;
    }

    // Certifications section
    if (profile.certifications && profile.certifications.length > 0) {
      if (currentY > doc.internal.pageSize.height - 50) {
        doc.addPage();
        currentY = 20;
      }
      currentY = renderCertifications(doc, profile.certifications, currentY);
    }

    // Footer with page numbers
    renderFooter(doc, selectedStyle);

    return doc;
  } catch (error) {
    console.error('Error generating CV:', error);
    throw error;
  }
};