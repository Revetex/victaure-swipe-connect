import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { pdfColors } from './colors';
import type { UserProfile } from '@/types/profile';

export const generateVCardPDF = async (profile: UserProfile) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85.6, 53.98]
  });

  // Background
  doc.setFillColor(pdfColors.background);
  doc.rect(0, 0, 85.6, 53.98, 'F');

  // Circuit pattern avec un effet plus subtil
  doc.setDrawColor(pdfColors.circuit.lines);
  doc.setLineWidth(0.1);
  for (let i = 0; i < 85.6; i += 5) {
    doc.line(i, 0, i, 53.98);
  }
  for (let i = 0; i < 53.98; i += 5) {
    doc.line(0, i, 85.6, i);
  }

  // Logo avec une taille optimisée
  const logoImg = new Image();
  logoImg.src = '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png';
  doc.addImage(logoImg, 'PNG', 2, 2, 10, 10);

  // Contenu principal avec une meilleure hiérarchie visuelle
  doc.setTextColor(pdfColors.text.primary);
  doc.setFontSize(16);
  doc.text(profile.full_name || 'Nom complet', 15, 8);

  doc.setFontSize(10);
  doc.setTextColor(pdfColors.text.secondary);
  if (profile.email) doc.text(profile.email, 15, 15);
  if (profile.phone) doc.text(profile.phone, 15, 20);
  if (profile.city) {
    const location = [profile.city, profile.state, profile.country]
      .filter(Boolean)
      .join(', ');
    doc.text(location, 15, 25);
  }

  // QR Code
  try {
    const qrDataUrl = await QRCode.toDataURL(window.location.href);
    doc.addImage(qrDataUrl, 'PNG', 65, 5, 15, 15);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  // Footer avec un style plus subtil
  doc.setFontSize(8);
  doc.setTextColor(pdfColors.text.muted);
  doc.text('Créé sur victaure.com', 85.6/2, 50, { align: 'center' });

  doc.save('carte-visite.pdf');
};