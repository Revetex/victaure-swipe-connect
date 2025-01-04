import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { extendPdfDocument } from "./pdfExtensions";

export const generateBusinessCard = async (profile: UserProfile): Promise<ExtendedJsPDF> => {
  const doc = extendPdfDocument(new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85.6, 53.98]
  }));

  // Company info
  doc.setFontSize(14);
  doc.text(profile.company_name || '', 10, 15);
  
  // Personal info
  doc.setFontSize(12);
  doc.text(profile.full_name || '', 10, 25);
  doc.setFontSize(10);
  doc.text(profile.role || '', 10, 30);
  
  // Contact details
  doc.setFontSize(8);
  doc.text(profile.email, 10, 40);
  if (profile.phone) doc.text(profile.phone, 10, 45);
  
  return doc;
};