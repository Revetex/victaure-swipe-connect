import jsPDF from 'jspdf';
import { UserProfile } from '@/types/profile';
import { StyleOption } from '@/components/vcard/types';
import QRCode from 'qrcode';

export async function generateBusinessCard(profile: UserProfile, style: StyleOption) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85, 55] // Standard business card size
  });

  // Set background color
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 85, 55, 'F');

  // Add metallic gradient effect
  const gradient = doc.context2d.createLinearGradient(0, 0, 85, 55);
  gradient.addColorStop(0, '#f5f5f5');
  gradient.addColorStop(0.5, '#ffffff');
  gradient.addColorStop(1, '#f0f0f0');
  doc.context2d.fillStyle = gradient;
  doc.context2d.fillRect(0, 0, 85, 55);

  // Add subtle border
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.rect(2, 2, 81, 51);

  // Set text color based on style
  doc.setTextColor(style.colors.text.primary);

  // Add name
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(profile.full_name || '', 10, 15);

  // Add role/title
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(profile.role || '', 10, 22);

  // Add contact information
  doc.setFontSize(8);
  if (profile.email) {
    doc.text(`Email: ${profile.email}`, 10, 30);
  }
  if (profile.phone) {
    doc.text(`Tel: ${profile.phone}`, 10, 35);
  }
  if (profile.website) {
    doc.text(`Web: ${profile.website}`, 10, 40);
  }

  // Generate and add QR Code
  try {
    const qrCodeUrl = await QRCode.toDataURL(profile.website || profile.email || '');
    doc.addImage(qrCodeUrl, 'PNG', 60, 15, 20, 20);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  // Add decorative elements
  doc.setDrawColor(style.colors.primary);
  doc.setLineWidth(0.3);
  // Use moveTo and lineTo instead of setLineDash
  doc.line(5, 45, 80, 45);

  return doc;
}