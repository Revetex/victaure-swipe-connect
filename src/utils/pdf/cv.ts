import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { StyleOption } from "@/components/vcard/types";
import { extendPdfDocument } from "./pdfExtensions";
import { generateCV } from "./cv/index";
import { pdfStyles } from "./cv/styles";

export const generatePDF = async (profile: UserProfile, style: StyleOption) => {
  // Initialize PDF document
  const doc = extendPdfDocument(new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  }));

  // Set default styles
  doc.setFontSize(pdfStyles.fonts.body.size);
  doc.setTextColor(pdfStyles.colors.text.primary);

  // Generate CV content
  await generateCV(doc, profile, style);

  // Return the PDF document
  return doc;
};