import jsPDF from 'jspdf';
import type { UserProfile } from '@/types/profile';
import { pdfStyles } from './styles';
import { drawHeader } from '../helpers';
import type { ExtendedJsPDF } from '../types';
import { renderHeader } from './sections/header';
import { renderContact } from './sections/contact';
import { renderBio } from './sections/bio';
import { renderSkills } from './sections/skills';
import { renderExperiences } from './sections/experiences';
import { renderEducation } from './sections/education';
import { renderFooter } from './sections/footer';

export const generateCV = async (profile: UserProfile): Promise<Uint8Array> => {
  // Initialize PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  }) as ExtendedJsPDF;

  // Set document properties
  doc.setProperties({
    title: `CV - ${profile.full_name}`,
    subject: 'Curriculum Vitae',
    author: profile.full_name,
    keywords: 'cv, resume, curriculum vitae',
    creator: 'Lovable CV Generator'
  });

  // Set initial y position
  let yPos = pdfStyles.margins.top;

  // Set document styles
  doc.setFont('helvetica');
  doc.setFontSize(pdfStyles.fonts.body.size);
  doc.setTextColor(pdfStyles.colors.text.primary);

  const accentColor = pdfStyles.colors.primary;

  // Render each section and update yPos
  yPos = await renderHeader(doc, profile, yPos);
  yPos = renderContact(doc, profile, yPos);
  yPos = renderBio(doc, profile, yPos);
  yPos = renderSkills(doc, profile, yPos);
  yPos = renderExperiences(doc, profile, yPos);
  yPos = renderEducation(doc, profile, yPos);
  await renderFooter(doc, accentColor);

  // Convert ArrayBuffer to Uint8Array before returning
  const arrayBuffer = doc.output('arraybuffer');
  return new Uint8Array(arrayBuffer);
};