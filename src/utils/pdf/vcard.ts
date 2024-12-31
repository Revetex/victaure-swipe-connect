import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { pdfColors } from './colors';
import type { UserProfile } from '@/types/profile';

export const generateVCardPDF = async (profile: UserProfile) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85.6, 53.98] // Standard business card size
  });

  // Background
  doc.setFillColor(pdfColors.background);
  doc.rect(0, 0, 85.6, 53.98, 'F');

  // Circuit pattern with subtle effect
  doc.setDrawColor(pdfColors.circuit.lines);
  doc.setLineWidth(0.1);
  for (let i = 0; i < 85.6; i += 5) {
    doc.line(i, 0, i, 53.98);
  }
  for (let i = 0; i < 53.98; i += 5) {
    doc.line(0, i, 85.6, i);
  }

  // Add gradient overlay
  doc.setFillColor(255, 255, 255);
  doc.setGlobalAlpha(0.1);
  doc.rect(0, 0, 85.6, 53.98, 'F');
  doc.setGlobalAlpha(1);

  // Name and Role
  doc.setTextColor(pdfColors.text.primary);
  doc.setFontSize(14);
  doc.text(profile.full_name || 'Nom complet', 10, 15);

  doc.setFontSize(10);
  doc.setTextColor(pdfColors.text.secondary);
  doc.text(profile.role || 'Rôle', 10, 22);

  // Contact Information
  doc.setFontSize(8);
  let yPosition = 30;
  const lineHeight = 4;

  if (profile.email) {
    doc.text(`Email: ${profile.email}`, 10, yPosition);
    yPosition += lineHeight;
  }

  if (profile.phone) {
    doc.text(`Tél: ${profile.phone}`, 10, yPosition);
    yPosition += lineHeight;
  }

  if (profile.city || profile.state || profile.country) {
    const location = [profile.city, profile.state, profile.country]
      .filter(Boolean)
      .join(', ');
    doc.text(`Adresse: ${location}`, 10, yPosition);
    yPosition += lineHeight;
  }

  // Skills section if available
  if (profile.skills && profile.skills.length > 0) {
    doc.setFontSize(8);
    doc.setTextColor(pdfColors.text.muted);
    const skills = profile.skills.slice(0, 3).join(' • ');
    doc.text(`Compétences: ${skills}`, 10, yPosition);
  }

  // QR Code
  try {
    const qrDataUrl = await QRCode.toDataURL(window.location.href);
    doc.addImage(qrDataUrl, 'PNG', 65, 10, 15, 15);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  // Footer
  doc.setFontSize(6);
  doc.setTextColor(pdfColors.text.muted);
  doc.text('Créé sur victaure.com', 85.6/2, 50, { align: 'center' });

  // Save the PDF
  doc.save(`${profile.full_name?.replace(/\s+/g, '_').toLowerCase() || 'carte-visite'}.pdf`);
};