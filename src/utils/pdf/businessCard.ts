import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { pdfColors } from './colors';
import type { UserProfile } from '@/types/profile';

export const generateBusinessCardPDF = async (profile: UserProfile) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85.6, 53.98]
  });

  // Background
  doc.setFillColor(pdfColors.background);
  doc.rect(0, 0, 85.6, 53.98, 'F');

  // Circuit pattern
  doc.setDrawColor(pdfColors.circuit.lines);
  doc.setLineWidth(0.1);
  for (let i = 0; i < 85.6; i += 5) {
    doc.line(i, 0, i, 53.98);
  }
  for (let i = 0; i < 53.98; i += 5) {
    doc.line(0, i, 85.6, i);
  }

  // Logo
  const logoImg = new Image();
  logoImg.src = '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png';
  doc.addImage(logoImg, 'PNG', 2, 2, 10, 10);

  // Content
  doc.setTextColor(pdfColors.text.primary);
  doc.setFontSize(16);
  doc.text(profile.full_name || 'Nom complet', 15, 15);

  doc.setFontSize(12);
  if (profile.company_name) doc.text(profile.company_name, 15, 22);
  if (profile.role) doc.text(profile.role, 15, 28);

  doc.setFontSize(10);
  doc.setTextColor(pdfColors.text.secondary);
  let yPos = 35;
  if (profile.email) doc.text(profile.email, 15, yPos);
  if (profile.phone) doc.text(profile.phone, 15, yPos + 5);
  if (profile.website) doc.text(profile.website, 15, yPos + 10);
  if (profile.city) {
    const location = [profile.city, profile.state, profile.country]
      .filter(Boolean)
      .join(', ');
    doc.text(location, 15, yPos + 15);
  }

  // QR Code
  try {
    const qrDataUrl = await QRCode.toDataURL(window.location.href);
    doc.addImage(qrDataUrl, 'PNG', 65, 5, 15, 15);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(pdfColors.text.muted);
  doc.text('Créé sur victaure.com', 85.6/2, 50, { align: 'center' });

  doc.save('carte-visite-professionnelle.pdf');
};