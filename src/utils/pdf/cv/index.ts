import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { extendPdfDocument } from "../pdfExtensions";
import { renderHeader } from "./sections/header";
import { renderBio } from "./sections/bio";
import { renderContact } from "./sections/contact";
import { renderSkills } from "./sections/skills";
import { renderExperiences } from "./sections/experiences";
import { renderEducation } from "./sections/education";
import { renderCertifications } from "./sections/certifications";
import { renderFooter } from "./sections/footer";

export const generateCV = async (profile: UserProfile): Promise<Uint8Array> => {
  // Initialize PDF document
  const baseDoc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Extend the document with custom methods
  const doc = extendPdfDocument(baseDoc);

  // Set document properties
  doc.setProperties({
    title: `CV - ${profile.full_name || 'Sans nom'}`,
    subject: 'Curriculum Vitae',
    author: profile.full_name || 'Sans nom',
    keywords: 'CV, Resume, Curriculum Vitae',
    creator: 'Victaure'
  });

  try {
    // Generate each section
    let currentY = await renderHeader(doc, profile, 20);
    currentY = await renderBio(doc, profile, currentY);
    currentY = await renderContact(doc, profile, currentY);
    currentY = await renderSkills(doc, profile, currentY);
    currentY = await renderExperiences(doc, profile, currentY);
    currentY = await renderEducation(doc, profile, currentY);
    currentY = await renderCertifications(doc, profile, currentY);
    await renderFooter(doc, profile.role || '#1E40AF');

    // Convert ArrayBuffer to Uint8Array before returning
    const arrayBuffer = doc.output('arraybuffer');
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error('Erreur lors de la génération du CV:', error);
    throw error;
  }
};