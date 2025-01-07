import { ExtendedJsPDF } from '../types';
import { UserProfile } from '@/types/profile';
import { StyleOption } from '@/components/vcard/types';
import { renderHeader } from './sections/header';
import { renderContact } from './sections/contact';
import { renderBio } from './sections/bio';
import { renderSkills } from './sections/skills';
import { renderExperiences } from './sections/experiences';
import { renderEducation } from './sections/education';
import { renderCertifications } from './sections/certifications';
import { renderFooter } from './sections/footer';
import { pdfStyles } from './styles';

export const generateCV = async (doc: ExtendedJsPDF, profile: UserProfile, style: StyleOption) => {
  let currentY = pdfStyles.margins.top;

  // Header section with photo and basic info
  currentY = await renderHeader(doc, profile, currentY);
  currentY += 10;

  // Contact information
  currentY = renderContact(doc, profile, currentY);
  currentY += 10;

  // Bio/Presentation
  if (profile.bio) {
    currentY = renderBio(doc, profile, currentY);
    currentY += 10;
  }

  // Skills section
  if (profile.skills?.length) {
    currentY = renderSkills(doc, profile, currentY);
    currentY += 10;
  }

  // Check if we need to add a new page
  if (currentY > doc.internal.pageSize.height - 100) {
    doc.addPage();
    currentY = pdfStyles.margins.top;
  }

  // Professional experiences
  if (profile.experiences?.length) {
    currentY = renderExperiences(doc, profile, currentY);
    currentY += 10;
  }

  // Check if we need to add a new page
  if (currentY > doc.internal.pageSize.height - 100) {
    doc.addPage();
    currentY = pdfStyles.margins.top;
  }

  // Education
  if (profile.education?.length) {
    currentY = renderEducation(doc, profile, currentY);
    currentY += 10;
  }

  // Certifications
  if (profile.certifications?.length) {
    currentY = renderCertifications(doc, profile.certifications, currentY);
  }

  // Footer with page numbers
  renderFooter(doc, style);

  return doc;
};