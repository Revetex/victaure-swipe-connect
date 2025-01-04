import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { pdfColors } from './colors';
import type { UserProfile } from '@/types/profile';

export const generateVCardPDF = async (profile: UserProfile) => {
  // Initialize PDF with explicit background color
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Set white background explicitly
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, 'F');

  // Add fonts
  doc.addFont('helvetica', 'normal');
  doc.addFont('helvetica', 'bold');

  // Header with profile photo
  if (profile.avatar_url) {
    try {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = profile.avatar_url;
      });
      doc.addImage(img, 'JPEG', 20, 20, 40, 40, undefined, 'FAST', 0);
      doc.setDrawColor(200, 200, 200);
      doc.rect(20, 20, 40, 40, 'S');
    } catch (error) {
      console.error('Error loading profile image:', error);
    }
  }

  // QR Code (top right corner)
  try {
    const qrDataUrl = await QRCode.toDataURL(window.location.href, {
      margin: 1,
      width: 150,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    doc.addImage(qrDataUrl, 'PNG', 160, 20, 30, 30, undefined, 'FAST', 0);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  // Name and Role with explicit colors
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(profile.full_name || 'Nom complet', 70, 35);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(profile.role || 'Rôle professionnel', 70, 45);

  // Contact Information
  let yPosition = 80;
  const lineHeight = 8;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Contact', 20, yPosition);
  yPosition += lineHeight * 1.5;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);

  if (profile.email) {
    doc.text(`Email: ${profile.email}`, 20, yPosition);
    yPosition += lineHeight;
  }

  if (profile.phone) {
    doc.text(`Téléphone: ${profile.phone}`, 20, yPosition);
    yPosition += lineHeight;
  }

  if (profile.city || profile.state || profile.country) {
    const location = [profile.city, profile.state, profile.country]
      .filter(Boolean)
      .join(', ');
    doc.text(`Adresse: ${location}`, 20, yPosition);
    yPosition += lineHeight * 2;
  }

  // Bio section
  if (profile.bio) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('À propos', 20, yPosition);
    yPosition += lineHeight;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const bioLines = doc.splitTextToSize(profile.bio, 170);
    doc.text(bioLines, 20, yPosition);
    yPosition += (bioLines.length * lineHeight) + lineHeight;
  }

  // Skills section
  if (profile.skills && profile.skills.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Compétences', 20, yPosition);
    yPosition += lineHeight;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const skillsText = profile.skills.join(' • ');
    const skillsLines = doc.splitTextToSize(skillsText, 170);
    doc.text(skillsLines, 20, yPosition);
    yPosition += (skillsLines.length * lineHeight) + lineHeight;
  }

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text('Généré sur victaure.com', 20, 285);

  // Save the PDF
  const fileName = `${profile.full_name?.replace(/\s+/g, '_').toLowerCase() || 'vcard'}.pdf`;
  doc.save(fileName);
};