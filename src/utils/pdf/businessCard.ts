import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { extendPdfDocument } from "./pdfExtensions";
import QRCode from "qrcode";

export const generateBusinessCard = async (profile: UserProfile, slogan: string) => {
  // Card dimensions in mm (standard business card size)
  const width = 85;
  const height = 55;
  
  // Initialize PDF
  const doc = extendPdfDocument(new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [width, height]
  }));

  // Front side
  doc.setFillColor(240, 240, 240);
  doc.rect(0, 0, width, height, "F");
  
  // Add name
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text(profile.full_name || "", 10, 15);
  
  // Add role
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(profile.role || "", 10, 22);
  
  // Add slogan
  doc.setFontSize(8);
  doc.text(slogan, 10, 30);
  
  // Add contact info
  doc.setFontSize(8);
  doc.text(profile.email || "", 10, 38);
  if (profile.phone) {
    doc.text(profile.phone, 10, 43);
  }
  
  // Generate QR Code
  const qrCodeDataUrl = await QRCode.toDataURL(profile.email || "");
  doc.addImage(qrCodeDataUrl, "PNG", 60, 15, 20, 20);
  
  // Add new page for back side
  doc.addPage([width, height], "landscape");
  
  // Back side with Victaure logo
  doc.setFillColor(240, 240, 240);
  doc.rect(0, 0, width, height, "F");
  
  // Add Victaure text as logo
  doc.setFontSize(24);
  doc.setTextColor(40, 40, 40);
  const text = "Victaure";
  const textWidth = doc.getTextWidth(text);
  doc.text(text, (width - textWidth) / 2, height / 2);
  
  return doc;
};