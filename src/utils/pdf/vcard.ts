import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { pdfColors } from './colors';
import type { UserProfile } from '@/types/profile';
import { drawHeader, drawSection } from './helpers';
import type { ExtendedJsPDF } from './types';

export const generateVCardPDF = async (profile: UserProfile) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  }) as unknown as ExtendedJsPDF;

  // Set background color
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, 'F');

  // Add gradient background with opacity
  const gradientSteps = 15;
  for (let i = 0; i < gradientSteps; i++) {
    const opacity = 0.05 - (i / gradientSteps) * 0.03;
    doc.setFillColor(pdfColors.background);
    doc.setGlobalAlpha(opacity);
    doc.rect(0, (i * 297) / gradientSteps, 210, 297 / gradientSteps, 'F');
  }
  doc.setGlobalAlpha(1);

  // Header section with profile info
  doc.setFontSize(24);
  doc.setTextColor(pdfColors.text.primary);
  doc.text(profile.full_name || 'Nom complet', 20, 30);

  doc.setFontSize(16);
  doc.setTextColor(pdfColors.text.secondary);
  doc.text(profile.role || 'Rôle professionnel', 20, 40);

  // Contact Information
  doc.setFontSize(12);
  let yPosition = 60;
  const lineHeight = 8;

  // Contact details with icons
  const contactInfo = [
    { label: 'Email:', value: profile.email },
    { label: 'Téléphone:', value: profile.phone },
    { label: 'Localisation:', value: [profile.city, profile.state, profile.country].filter(Boolean).join(', ') }
  ];

  contactInfo.forEach(({ label, value }) => {
    if (value) {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 50, yPosition);
      yPosition += lineHeight;
    }
  });

  // Skills section
  if (profile.skills && profile.skills.length > 0) {
    yPosition += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Compétences', 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const skillsPerRow = 3;
    const skillChunks = [];
    for (let i = 0; i < profile.skills.length; i += skillsPerRow) {
      skillChunks.push(profile.skills.slice(i, i + skillsPerRow));
    }

    skillChunks.forEach(chunk => {
      const skillsText = chunk.join(' • ');
      doc.text(skillsText, 20, yPosition);
      yPosition += 6;
    });
  }

  // Bio section if available
  if (profile.bio) {
    yPosition += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('À propos', 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const bioLines = doc.splitTextToSize(profile.bio, 170);
    doc.text(bioLines, 20, yPosition);
    yPosition += bioLines.length * 6;
  }

  // QR Code
  try {
    const qrDataUrl = await QRCode.toDataURL(window.location.href, {
      margin: 0,
      width: 256,
      color: {
        dark: pdfColors.text.primary,
        light: '#FFFFFF'
      }
    });
    doc.addImage(qrDataUrl, 'PNG', 160, 20, 30, 30);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(pdfColors.text.muted);
  doc.text('Généré sur victaure.com', 20, 285);

  // Save the PDF
  const cleanName = profile.full_name?.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'vcard';
  doc.save(`${cleanName}_vcard.pdf`);
};