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

    // Create custom styles based on selected VCard style
    const customStyles = {
      ...pdfStyles,
      colors: {
        ...pdfStyles.colors,
        primary: selectedStyle.color,
        secondary: selectedStyle.secondaryColor,
        text: {
          primary: '#1A1F2C',
          secondary: '#555555',
          muted: '#8E9196'
        }
      },
      fonts: {
        ...pdfStyles.fonts,
        family: selectedStyle.font || 'helvetica'
      }
    };

    // Set initial Y position
    let currentY = 20;

    // Render each section and update currentY
    currentY = await renderHeader(doc, profile, currentY);
    currentY = await renderBio(doc, profile, currentY);
    currentY = await renderContact(doc, profile, currentY);
    currentY = await renderSkills(doc, profile, currentY);
    currentY = await renderExperiences(doc, profile, currentY);
    currentY = await renderEducation(doc, profile, currentY);
    
    if (profile.certifications) {
      currentY = renderCertifications(doc, profile.certifications, currentY);
    }
    
    // Render footer with QR code
    await renderFooter(doc, selectedStyle.color);

    return doc;
  } catch (error) {
    console.error('Error generating CV:', error);
    throw error;
  }
};