import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { StyleOption } from "@/components/vcard/types";
import { extendPdfDocument } from "./pdfExtensions";
import { generateCV } from "./cv/index";
import { pdfStyles } from "./cv/styles";

export const generatePDF = async (profile: UserProfile, style: StyleOption) => {
  // Initialize PDF with metallic theme
  const doc = extendPdfDocument(new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  }));

  // Override default styles with metallic theme
  const metallicStyles = {
    ...pdfStyles,
    colors: {
      ...pdfStyles.colors,
      primary: '#00c896', // Emerald green
      secondary: '#808080', // Metallic gray
      background: '#1a1a1a', // Dark background
      text: {
        primary: '#e6e6e6', // Light text
        secondary: '#b3b3b3', // Metallic silver
        muted: '#666666' // Darker silver
      }
    }
  };

  // Generate CV content with metallic theme
  await generateCV(doc, profile, { ...style, colors: metallicStyles.colors });

  return doc;
};