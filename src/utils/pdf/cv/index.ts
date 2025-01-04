import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { pdfStyles } from '../styles';
import { extendPdfDocument } from "../pdfExtensions";
import { StyleOption } from "@/components/vcard/types";
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

export const generateCV = async (
  profile: UserProfile, 
  selectedStyle: StyleOption
): Promise<ExtendedJsPDF> => {
  try {
    // Initialize PDF document
    const doc = extendPdfDocument(new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    }));

    // Apply selected style colors
    const customStyles = {
      ...pdfStyles,
      colors: {
        ...pdfStyles.colors,
        primary: selectedStyle.color,
        secondary: selectedStyle.secondaryColor,
      },
      fonts: {
        ...pdfStyles.fonts,
        family: selectedStyle.font
      }
    };

    // Set initial Y position
    let currentY = 20;

    // Render each section and update currentY
    currentY = await renderHeader(doc, profile, currentY, customStyles);
    currentY = await renderBio(doc, profile, currentY, customStyles);
    currentY = await renderContact(doc, profile, currentY, customStyles);
    currentY = await renderSkills(doc, profile, currentY, customStyles);
    currentY = await renderExperiences(doc, profile, currentY, customStyles);
    currentY = await renderEducation(doc, profile, currentY, customStyles);
    currentY = await renderCertifications(doc, profile, currentY, customStyles);
    
    // Render footer with QR code
    renderFooter(doc, customStyles);

    return doc;
  } catch (error) {
    console.error('Error generating CV:', error);
    throw error;
  }
};