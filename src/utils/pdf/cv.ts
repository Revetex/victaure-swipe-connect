import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { StyleOption } from "@/components/vcard/types";
import { extendPdfDocument } from "./pdfExtensions";
import { renderHeader } from "./cv/sections/header";
import { renderBio } from "./cv/sections/bio";
import { renderContact } from "./cv/sections/contact";
import { renderSkills } from "./cv/sections/skills";
import { renderExperiences } from "./cv/sections/experiences";
import { renderEducation } from "./cv/sections/education";
import { renderCertifications } from "./cv/sections/certifications";
import { renderFooter } from "./cv/sections/footer";

export const generateCV = async (
  profile: UserProfile,
  selectedStyle: StyleOption
): Promise<ExtendedJsPDF> => {
  // Create and extend the PDF document with A4 format
  const doc = extendPdfDocument(new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  }));

  // Set initial styles based on selected theme
  doc.setFont("helvetica");
  doc.setTextColor(selectedStyle.colors.text.primary);

  let currentY = 20;

  // Add subtle background pattern
  doc.setDrawColor(selectedStyle.colors.primary);
  doc.setFillColor(selectedStyle.colors.background.card);
  doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

  // Add decorative header line
  doc.setLineWidth(0.5);
  doc.line(20, 15, doc.internal.pageSize.width - 20, 15);

  // Header with profile info
  currentY = await renderHeader(doc, profile, currentY);
  currentY += 10;

  // Contact information in a styled box
  doc.setFillColor(245, 245, 245);
  doc.rect(15, currentY - 5, doc.internal.pageSize.width - 30, 25, 'F');
  currentY = renderContact(doc, profile, currentY);
  currentY += 15;

  // Bio section if available
  if (profile.bio) {
    currentY = renderBio(doc, profile, currentY);
    currentY += 10;
  }

  // Skills section with improved layout
  if (profile.skills && profile.skills.length > 0) {
    currentY = renderSkills(doc, profile, currentY);
    currentY += 10;
  }

  // Check if we need a new page
  if (currentY > doc.internal.pageSize.height - 50) {
    doc.addPage();
    currentY = 20;
  }

  // Experience section with timeline
  if (profile.experiences && profile.experiences.length > 0) {
    currentY = renderExperiences(doc, profile, currentY);
    currentY += 10;
  }

  // Check if we need a new page
  if (currentY > doc.internal.pageSize.height - 50) {
    doc.addPage();
    currentY = 20;
  }

  // Education section with timeline
  if (profile.education && profile.education.length > 0) {
    currentY = renderEducation(doc, profile, currentY);
    currentY += 10;
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
  await renderFooter(doc, selectedStyle);

  return doc;
};