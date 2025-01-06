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
import { pdfStyles } from "./cv/styles";

export const generateCV = async (
  profile: UserProfile,
  selectedStyle: StyleOption
): Promise<ExtendedJsPDF> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  }) as ExtendedJsPDF;

  let currentY = 20;

  // Header with profile info
  currentY = await renderHeader(doc, profile, currentY, selectedStyle);
  currentY += 10;

  // Contact information
  currentY = renderContact(doc, profile, currentY);
  currentY += 10;

  // Bio section if available
  if (profile.bio) {
    currentY = renderBio(doc, profile, currentY);
    currentY += 10;
  }

  // Skills section
  if (profile.skills && profile.skills.length > 0) {
    currentY = renderSkills(doc, profile, currentY);
    currentY += 10;
  }

  // Experience section
  if (profile.experiences && profile.experiences.length > 0) {
    currentY = renderExperiences(doc, profile, currentY);
    currentY += 10;
  }

  // Education section
  if (profile.education && profile.education.length > 0) {
    currentY = renderEducation(doc, profile, currentY);
    currentY += 10;
  }

  // Certifications section
  if (profile.certifications && profile.certifications.length > 0) {
    currentY = renderCertifications(doc, profile.certifications, currentY, pdfStyles);
    currentY += 10;
  }

  // Footer with QR code and branding
  await renderFooter(doc, selectedStyle);

  return doc;
};