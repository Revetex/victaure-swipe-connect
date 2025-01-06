import { ExtendedJsPDF } from '../../types';
import QRCode from 'qrcode';
import { StyleOption } from '@/components/vcard/types';

export const renderFooter = async (
  doc: ExtendedJsPDF,
  style: StyleOption
): Promise<void> => {
  try {
    // Generate QR code only once
    const qrDataUrl = await QRCode.toDataURL(window.location.href, {
      margin: 0,
      width: 256,
      color: {
        dark: style.colors.text.primary,
        light: '#FFFFFF'
      }
    });

    // Position QR code at the bottom right
    doc.addImage(qrDataUrl, 'PNG', 170, 260, 30, 30);

    // Add footer with style-based colors
    const footerColor = style.color + '1A'; // 1A = 10% opacity in hex
    doc.setFillColor(footerColor);
    doc.rect(0, 280, 210, 17, 'F');
    
    doc.setFontSize(8);
    doc.setTextColor(style.colors.text.muted);
    doc.text('Créé sur victaure.com', 105, 285, { align: 'center' });
  } catch (error) {
    console.error('Error in renderFooter:', error);
  }
};