import { jsPDF } from "jspdf";
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
    let currentY = renderHeader(doc, profile, 20);
    currentY = renderBio(doc, profile, currentY);
    currentY = renderContact(doc, profile, currentY);
    currentY = renderSkills(doc, profile, currentY);
    currentY = renderExperiences(doc, profile, currentY);
    currentY = renderEducation(doc, profile, currentY);
    currentY = renderCertifications(doc, profile, currentY);
    renderFooter(doc, profile.role || '#1E40AF');

    // Convert ArrayBuffer to Uint8Array before returning
    const arrayBuffer = doc.output('arraybuffer');
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error('Erreur lors de la génération du CV:', error);
    toast.error("Une erreur est survenue lors de la génération du CV");
    throw error;
  }
};

// Export both CV and VCard PDF generators
export const generateCVPDF = generateCV;
export const generateVCardPDF = generateCV;