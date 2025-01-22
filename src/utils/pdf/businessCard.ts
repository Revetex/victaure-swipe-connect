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

  // Front side
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

  // Add Victaure logo
  const logoImg = new Image();
  logoImg.src = '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png';
  await new Promise((resolve) => {
    logoImg.onload = resolve;
  });
  doc.addImage(logoImg, 'PNG', 5, 5, 10, 10);

  // Set text color based on style
  doc.setTextColor(style.colors.text.primary);

  // Add name
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(profile.full_name || '', 10, 20);

  // Add role/title
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(profile.role || '', 10, 27);

  // Add contact information
  doc.setFontSize(8);
  if (profile.email) {
    doc.text(`Email: ${profile.email}`, 10, 35);
  }
  if (profile.phone) {
    doc.text(`Tel: ${profile.phone}`, 10, 40);
  }
  if (profile.website) {
    doc.text(`Web: ${profile.website}`, 10, 45);
  }

  // Generate QR Code with CV view parameter
  try {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('view', 'cv');
    const qrCodeUrl = await QRCode.toDataURL(currentUrl.toString());
    doc.addImage(qrCodeUrl, 'PNG', 60, 15, 20, 20);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  // Add decorative elements
  doc.setDrawColor(style.colors.primary);
  doc.setLineWidth(0.3);
  doc.line(5, 45, 80, 45);

  // Add back side
  doc.addPage();
  
  // Set background for back side
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 85, 55, 'F');
  
  // Add gradient to back side
  doc.context2d.fillStyle = gradient;
  doc.context2d.fillRect(0, 0, 85, 55);
  
  // Add border to back side
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.rect(2, 2, 81, 51);

  // Add Victaure logo centered on back
  doc.addImage(logoImg, 'PNG', 32.5, 17.5, 20, 20);

  return doc;
}