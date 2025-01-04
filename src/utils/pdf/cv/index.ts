import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { extendPdfDocument } from "../pdfExtensions";
import { generateHeader } from "./sections/header";
import { generateBio } from "./sections/bio";
import { generateContact } from "./sections/contact";
import { generateSkills } from "./sections/skills";
import { generateExperiences } from "./sections/experiences";
import { generateEducation } from "./sections/education";
import { generateCertifications } from "./sections/certifications";
import { generateFooter } from "./sections/footer";

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
    let currentY = await generateHeader(doc, profile);
    currentY = await generateBio(doc, profile, currentY);
    currentY = await generateContact(doc, profile, currentY);
    currentY = await generateSkills(doc, profile, currentY);
    currentY = await generateExperiences(doc, profile, currentY);
    currentY = await generateEducation(doc, profile, currentY);
    currentY = await generateCertifications(doc, profile, currentY);
    await generateFooter(doc, profile, currentY);

    // Convert ArrayBuffer to Uint8Array before returning
    const arrayBuffer = doc.output('arraybuffer');
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error('Erreur lors de la génération du CV:', error);
    throw error;
  }
};