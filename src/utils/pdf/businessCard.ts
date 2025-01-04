import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { extendPdfDocument } from "./pdfExtensions";
import { StyleOption } from "@/components/vcard/types";
import QRCode from "qrcode";

export const generateBusinessCard = async (
  profile: UserProfile,
  selectedStyle: StyleOption
): Promise<ExtendedJsPDF> => {
  const doc = extendPdfDocument(new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85.6, 53.98]
  }));

  // Apply gradient background using selected style
  doc.setFillColor(selectedStyle.color);
  doc.rect(0, 0, 85.6, 53.98, 'F');

  // Add profile photo if available
  if (profile.avatar_url) {
    try {
      const img = await loadImage(profile.avatar_url);
      doc.addImage(img, 'JPEG', 5, 5, 20, 20, undefined, 'MEDIUM');
    } catch (error) {
      console.error('Error loading profile image:', error);
    }
  }

  // Set font family and colors based on selected style
  doc.setFont(selectedStyle.font || 'helvetica');
  doc.setTextColor(255, 255, 255); // White text for contrast

  // Company info with improved spacing
  doc.setFontSize(14);
  doc.text(profile.company_name || '', 30, 12);
  
  // Personal info with better layout
  doc.setFontSize(12);
  doc.text(profile.full_name || '', 30, 20);
  doc.setFontSize(10);
  doc.text(profile.role || '', 30, 26);
  
  // Contact details with icons and improved spacing
  doc.setFontSize(8);
  if (profile.email) doc.text(profile.email, 30, 34);
  if (profile.phone) doc.text(profile.phone, 30, 39);
  if (profile.website) doc.text(profile.website, 30, 44);

  // Add QR code with better positioning
  try {
    const qrCodeUrl = await QRCode.toDataURL(window.location.href);
    doc.addImage(qrCodeUrl, 'PNG', 60, 5, 20, 20);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
  
  return doc;
};

// Helper function to load images
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};