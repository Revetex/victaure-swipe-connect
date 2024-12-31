import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { pdfColors } from './colors';
import type { UserProfile } from '@/types/profile';

export const generateBusinessCardPDF = async (profile: UserProfile) => {
  // Standard business card size in mm (85.6 x 53.98)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85.6, 53.98]
  });

  // Background
  doc.setFillColor(pdfColors.background);
  doc.rect(0, 0, 85.6, 53.98, 'F');

  // Add subtle gradient effect using multiple rectangles with hex colors
  for (let i = 0; i < 85.6; i += 2) {
    const shade = Math.floor((i / 85.6) * 20); // 0-20% variation
    doc.setFillColor(`#${(parseInt(pdfColors.background.slice(1), 16) + shade).toString(16).padStart(6, '0')}`);
    doc.rect(i, 0, 2, 53.98, 'F');
  }

  // Circuit pattern with subtle effect
  doc.setDrawColor(pdfColors.circuit.lines);
  doc.setLineWidth(0.1);
  for (let i = 0; i < 85.6; i += 10) {
    doc.line(i, 0, i, 53.98);
  }
  for (let i = 0; i < 53.98; i += 10) {
    doc.line(0, i, 85.6, i);
  }

  // Add decorative elements
  doc.setDrawColor(pdfColors.primary);
  doc.setLineWidth(0.5);
  doc.line(5, 5, 80.6, 5);
  doc.line(5, 48.98, 80.6, 48.98);

  // Main Content Area
  doc.setTextColor(pdfColors.text.primary);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(profile.full_name || '', 15, 15);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(pdfColors.text.secondary);
  let yPos = 22;

  // Role
  if (profile.role) {
    doc.text(profile.role, 15, yPos);
    yPos += 6;
  }

  // Company
  if (profile.company_name) {
    doc.text(profile.company_name, 15, yPos);
    yPos += 6;
  }

  // Contact Information
  doc.setFontSize(9);
  doc.setTextColor(pdfColors.text.muted);

  // Email
  if (profile.email) {
    doc.text(`Email: ${profile.email}`, 15, yPos);
    yPos += 4;
  }

  // Phone
  if (profile.phone) {
    doc.text(`Tél: ${profile.phone}`, 15, yPos);
    yPos += 4;
  }

  // Location
  if (profile.city || profile.state || profile.country) {
    const location = [profile.city, profile.state, profile.country]
      .filter(Boolean)
      .join(', ');
    doc.text(location, 15, yPos);
  }

  // QR Code
  try {
    const qrDataUrl = await QRCode.toDataURL(window.location.href, {
      margin: 0,
      width: 256,
      color: {
        dark: pdfColors.text.primary.slice(1), // Remove # from hex
        light: '#0000' // Transparent background
      }
    });
    doc.addImage(qrDataUrl, 'PNG', 65, 15, 15, 15);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  // Website
  if (profile.website) {
    doc.setFontSize(8);
    doc.setTextColor(pdfColors.text.muted);
    doc.text(profile.website, 65, 35, { align: 'left' });
  }

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(pdfColors.text.muted);
  doc.text('Créé sur victaure.com', 85.6/2, 51, { align: 'center' });

  // Save the PDF
  const fileName = `carte-visite-${profile.full_name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'professionnel'}.pdf`;
  doc.save(fileName);
};