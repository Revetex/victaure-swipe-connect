import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { extendPdfDocument } from "./pdfExtensions";
import { generateHeader } from "./cv/sections/header";
import { generateBio } from "./cv/sections/bio";
import { generateContact } from "./cv/sections/contact";
import { generateSkills } from "./cv/sections/skills";
import { generateExperiences } from "./cv/sections/experiences";
import { generateEducation } from "./cv/sections/education";
import { generateCertifications } from "./cv/sections/certifications";
import { generateFooter } from "./cv/sections/footer";
import { toast } from "sonner";

export const generateCV = async (profile: UserProfile): Promise<Uint8Array> => {
  try {
    // Initialize PDF document with A4 size
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
    toast.error("Une erreur est survenue lors de la génération du CV");
    throw error;
  }
};