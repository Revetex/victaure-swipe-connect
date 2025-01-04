import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { pdfColors } from './colors';
import type { UserProfile } from '@/types/profile';
import { drawHeader, drawSection } from './helpers';

export const generateBusinessCardPDF = async (profile: UserProfile) => {
  // Standard business card size in mm (85.6 x 53.98)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85.6, 53.98]
  });

  // Add background and decorative elements
  drawHeader(doc, 53.98, pdfColors.background, pdfColors.circuit.lines);
  drawSection(doc, 10, 75.6, 33.98, pdfColors.primary);

  // Main Content Area
  doc.setTextColor(pdfColors.text.primary);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(profile.full_name || '', 15, 15);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(pdfColors.text.secondary);
  let yPos = 22;

  // Role & Company
  if (profile.role) {
    doc.text(profile.role, 15, yPos);
    yPos += 6;
  }
  if (profile.company_name) {
    doc.text(profile.company_name, 15, yPos);
    yPos += 6;
  }

  // Contact Information
  doc.setFontSize(9);
  doc.setTextColor(pdfColors.text.muted);

  const contactInfo = [
    { label: 'Email:', value: profile.email },
    { label: 'Tél:', value: profile.phone },
    { label: 'Location:', value: [profile.city, profile.state, profile.country].filter(Boolean).join(', ') }
  ];

  contactInfo.forEach(({ label, value }) => {
    if (value) {
      doc.text(`${label} ${value}`, 15, yPos);
      yPos += 4;
    }
  });

  // QR Code
  try {
    const qrDataUrl = await QRCode.toDataURL(window.location.href, {
      margin: 0,
      width: 256,
      color: {
        dark: pdfColors.text.primary.slice(1),
        light: '#0000'
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