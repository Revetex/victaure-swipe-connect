import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { extendPdfDocument } from "./pdfExtensions";

export const generateVCard = async (profile: UserProfile): Promise<ExtendedJsPDF> => {
  const doc = extendPdfDocument(new jsPDF());
  
  const vCardData = `
BEGIN:VCARD
VERSION:3.0
FN:${profile.full_name || ''}
EMAIL:${profile.email || ''}
TEL:${profile.phone || ''}
ADR:;;${profile.city || ''};${profile.state || ''};${profile.country || ''}
END:VCARD
  `;
  
  const blob = new Blob([vCardData], { type: "text/vcard" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${profile.full_name?.replace(/\s+/g, '_').toLowerCase() || 'profile'}.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  return doc;
};
