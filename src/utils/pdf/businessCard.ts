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
  // Metallic gradient background
  doc.setFillColor(20, 20, 20);
  doc.rect(0, 0, width, height, "F");

  // Add metallic effect lines
  doc.setDrawColor(40, 40, 40);
  doc.setLineWidth(0.1);
  for (let i = 0; i < width; i += 2) {
    doc.line(i, 0, i, height);
  }
  
  // Add name
  doc.setFontSize(16);
  doc.setTextColor(0, 200, 150); // Emerald green for metallic effect
  doc.text(profile.full_name || "", 10, 15);
  
  // Add role
  doc.setFontSize(12);
  doc.setTextColor(180, 180, 180); // Metallic silver
  doc.text(profile.role || "", 10, 22);
  
  // Add slogan in italics
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  const sloganLines = doc.splitTextToSize(slogan, 40);
  doc.text(sloganLines, 10, 30);
  
  // Add contact info
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  if (profile.email) doc.text(profile.email, 10, 38);
  if (profile.phone) doc.text(profile.phone, 10, 43);
  if (profile.city) doc.text(`${profile.city}, ${profile.country}`, 10, 48);
  
  // Generate QR Code with profile URL
  const profileUrl = `https://victaure.com/profile/${profile.id}`;
  const qrCodeDataUrl = await QRCode.toDataURL(profileUrl, {
    color: {
      dark: '#00c896', // Emerald green QR code
      light: '#00000000' // Transparent background
    },
    width: 500,
    margin: 1
  });
  
  // Add QR code
  doc.addImage(qrCodeDataUrl, "PNG", 55, 10, 25, 25);
  
  // Back side
  doc.addPage([width, height], "landscape");
  
  // Metallic background with dot pattern
  doc.setFillColor(20, 20, 20);
  doc.rect(0, 0, width, height, "F");
  
  // Add dot pattern
  doc.setDrawColor(40, 120, 100);
  doc.setLineWidth(0.1);
  for (let x = 5; x < width - 5; x += 3) {
    for (let y = 5; y < height - 5; y += 3) {
      doc.circle(x, y, 0.2, 'F');
    }
  }
  
  // Add Victaure logo
  doc.setFontSize(24);
  doc.setTextColor(0, 200, 150);
  const text = "Victaure";
  const textWidth = doc.getTextWidth(text);
  doc.text(text, (width - textWidth) / 2, height / 2);
  
  return doc;
};