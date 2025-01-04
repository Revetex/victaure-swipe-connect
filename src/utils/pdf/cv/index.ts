import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { pdfStyles } from '../styles';
import { extendPdfDocument } from "../pdfExtensions";
import {
  renderHeader,
  renderBio,
  renderContact,
  renderSkills,
  renderExperiences,
  renderEducation,
  renderCertifications,
  renderFooter
} from './sections';

export const generateCV = async (profile: UserProfile): Promise<ExtendedJsPDF> => {
  try {
    // Initialize PDF document
    const doc = extendPdfDocument(new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    }));

    // Set initial Y position
    let currentY = 20;

    // Render each section and update currentY
    currentY = await renderHeader(doc, profile, currentY);
    currentY = await renderBio(doc, profile, currentY);
    currentY = await renderContact(doc, profile, currentY);
    currentY = await renderSkills(doc, profile, currentY);
    currentY = await renderExperiences(doc, profile, currentY);
    currentY = await renderEducation(doc, profile, currentY);
    currentY = await renderCertifications(doc, profile, currentY);
    
    // Render footer
    renderFooter(doc, pdfStyles.colors.primary);

    return doc;
  } catch (error) {
    console.error('Error generating CV:', error);
    throw error;
  }
};