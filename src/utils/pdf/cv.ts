import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { pdfColors } from './colors';
import { extendPdfDocument } from "./pdfExtensions";
import { StyleOption } from "@/components/vcard/types";
import QRCode from "qrcode";

export const generateCV = async (profile: UserProfile, style?: StyleOption): Promise<ExtendedJsPDF> => {
  const doc = extendPdfDocument(new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  }));

  const colors = style?.colors || pdfColors;
  const font = style?.font || 'helvetica';
  let currentY = 10;

  // Generate QR Code
  const qrCodeDataUrl = await QRCode.toDataURL(window.location.href);

  // Header section with photo and QR code
  if (profile.avatar_url) {
    doc.addImage(profile.avatar_url, 'JPEG', 20, currentY, 30, 30);
    doc.addImage(qrCodeDataUrl, 'PNG', 160, currentY, 30, 30);
  }
  currentY += 35;

  // Header text
  doc.setFontSize(24);
  doc.setFont(font, 'bold');
  doc.setTextColor(colors.text.primary);
  doc.text(profile.full_name || 'No Name', 20, currentY);
  currentY += 10;

  // Role
  doc.setFontSize(16);
  doc.setFont(font, 'normal');
  doc.setTextColor(colors.text.secondary);
  doc.text(profile.role || 'No Role', 20, currentY);
  currentY += 10;

  // Bio
  if (profile.bio) {
    doc.setFontSize(12);
    doc.setTextColor(colors.text.primary);
    const bioLines = doc.splitTextToSize(profile.bio, 170);
    doc.text(bioLines, 20, currentY);
    currentY += bioLines.length * 5 + 10;
  }

  // Contact Info
  doc.setFontSize(12);
  doc.setTextColor(colors.text.primary);
  doc.text(`Email: ${profile.email}`, 20, currentY);
  currentY += 5;
  if (profile.phone) {
    doc.text(`Phone: ${profile.phone}`, 20, currentY);
    currentY += 5;
  }
  if (profile.city || profile.state) {
    doc.text(`Location: ${[profile.city, profile.state].filter(Boolean).join(', ')}`, 20, currentY);
    currentY += 10;
  }

  // Skills
  if (profile.skills && profile.skills.length > 0) {
    doc.setFontSize(14);
    doc.setFont(font, 'bold');
    doc.setTextColor(colors.text.primary);
    doc.text('Skills', 20, currentY);
    currentY += 5;
    
    doc.setFont(font, 'normal');
    doc.setFontSize(12);
    doc.setTextColor(colors.text.secondary);
    const skillsText = profile.skills.join(', ');
    const skillsLines = doc.splitTextToSize(skillsText, 170);
    doc.text(skillsLines, 20, currentY);
    currentY += skillsLines.length * 5 + 10;
  }

  // Footer
  doc.setTextColor(colors.text.muted);
  doc.setFontSize(10);
  doc.text('Generated with Victaure', 105, 287, { align: 'center' });

  return doc;
};