import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { StyleOption } from "@/components/vcard/types";
import QRCode from "qrcode";
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

  // Set colors based on selected style
  const primaryColor = selectedStyle?.color || '#1E40AF';
  const secondaryColor = selectedStyle?.secondaryColor || '#1E40AF80';
  
  let currentY = 20;

  // Add header with profile info
  currentY = await renderHeader(doc, profile, currentY);
  currentY += 10;

  // Add contact information
  currentY = renderContact(doc, profile, currentY);
  currentY += 10;

  // Add bio if available
  if (profile.bio) {
    currentY = renderBio(doc, profile, currentY);
    currentY += 10;
  }

  // Add skills section
  if (profile.skills && profile.skills.length > 0) {
    currentY = renderSkills(doc, profile, currentY);
    currentY += 10;
  }

  // Add experience section
  if (profile.experiences && profile.experiences.length > 0) {
    currentY = renderExperiences(doc, profile, currentY);
    currentY += 10;
  }

  // Add education section
  if (profile.education && profile.education.length > 0) {
    currentY = renderEducation(doc, profile, currentY);
    currentY += 10;
  }

  // Add certifications section if available
  if (profile.certifications && profile.certifications.length > 0) {
    currentY = renderCertifications(doc, profile.certifications, currentY, pdfStyles);
    currentY += 10;
  }

  // Add footer with QR code and branding
  await renderFooter(doc, primaryColor);

  return doc;
};