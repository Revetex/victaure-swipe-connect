import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { extendPdfDocument } from "./pdfExtensions";

export const generateVCard = async (profile: UserProfile): Promise<ExtendedJsPDF> => {
  const doc = extendPdfDocument(new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [85.6, 53.98]
  }));

  // Basic info
  doc.setFontSize(12);
  doc.text(profile.full_name || '', 10, 10);
  doc.setFontSize(10);
  doc.text(profile.role || '', 10, 15);
  
  // Contact info
  doc.setFontSize(8);
  doc.text(profile.email, 10, 25);
  if (profile.phone) doc.text(profile.phone, 10, 30);
  
  return doc;
};