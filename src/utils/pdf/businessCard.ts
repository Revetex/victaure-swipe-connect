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

  // Set background gradient
  const gradient = doc.setFillColor(selectedStyle.color);
  doc.rect(0, 0, 85.6, 53.98, 'F');

  try {
    // Add Victaure logo in the middle
    const logoImg = new Image();
    logoImg.src = "/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png";
    await new Promise((resolve, reject) => {
      logoImg.onload = resolve;
      logoImg.onerror = reject;
    });
    doc.addImage(logoImg, 'PNG', 35, 20, 15, 15);

    // Add profile photo on the left if available
    if (profile.avatar_url) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = profile.avatar_url;
      });
      doc.addImage(img, 'JPEG', 5, 5, 20, 20);
    }
  } catch (error) {
    console.error('Error loading images:', error);
  }

  // Set text color and font based on style
  doc.setTextColor(255, 255, 255);
  doc.setFont(selectedStyle.font || 'helvetica');

  // Add name and position next to photo
  const textStartX = profile.avatar_url ? 30 : 5;
  doc.setFontSize(14);
  doc.setFont(selectedStyle.font || 'helvetica', 'bold');
  doc.text(profile.full_name || '', textStartX, 15);
  
  doc.setFontSize(12);
  doc.setFont(selectedStyle.font || 'helvetica', 'normal');
  doc.text(profile.role || '', textStartX, 22);

  // Add contact details at the bottom left
  doc.setFontSize(9);
  let contactY = 40;
  
  if (profile.email) {
    doc.text(profile.email, 5, contactY);
    contactY += 5;
  }
  
  if (profile.phone) {
    doc.text(profile.phone, 5, contactY);
    contactY += 5;
  }
  
  if (profile.city) {
    doc.text(profile.city, 5, contactY);
  }

  // Add QR code in bottom right corner
  try {
    const qrCodeUrl = await QRCode.toDataURL(window.location.href);
    doc.addImage(qrCodeUrl, 'PNG', 65, 35, 15, 15);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  return doc;
};