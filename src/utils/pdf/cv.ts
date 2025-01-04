import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { extendPdfDocument } from "./pdfExtensions";
import { renderHeader } from "./cv/sections/header";
import { renderBio } from "./cv/sections/bio";
import { renderContact } from "./cv/sections/contact";
import { renderSkills } from "./cv/sections/skills";
import { renderExperiences } from "./cv/sections/experiences";
import { renderEducation } from "./cv/sections/education";
import { renderCertifications } from "./cv/sections/certifications";
import { renderFooter } from "./cv/sections/footer";

export const generateCV = async (profile: UserProfile): Promise<ExtendedJsPDF> => {
  const doc = extendPdfDocument();
  let currentY = 10;

  // Header section
  currentY = await renderHeader(doc, profile, currentY);
  doc.addSpace(currentY, 10);
  currentY += 10;

  // Bio section
  currentY = await renderBio(doc, profile, currentY);
  doc.addSpace(currentY, 10);
  currentY += 10;

  // Contact section
  currentY = await renderContact(doc, profile, currentY);
  doc.addSpace(currentY, 10);
  currentY += 10;

  // Skills section
  currentY = await renderSkills(doc, profile, currentY);
  doc.addSpace(currentY, 10);
  currentY += 10;

  // Experience section
  currentY = await renderExperiences(doc, profile, currentY);
  doc.addSpace(currentY, 10);
  currentY += 10;

  // Education section
  currentY = await renderEducation(doc, profile, currentY);
  doc.addSpace(currentY, 10);
  currentY += 10;

  // Certifications section
  currentY = await renderCertifications(doc, profile, currentY);
  doc.addSpace(currentY, 10);
  currentY += 10;

  // Footer
  await renderFooter(doc, profile, currentY, doc.internal.pageSize.width);

  return doc;
};