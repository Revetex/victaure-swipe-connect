import { ExtendedJsPDF } from '../../types';
import QRCode from 'qrcode';

export const renderFooter = async (
  doc: ExtendedJsPDF,
  accentColor: string
): Promise<void> => {
  try {
    const qrDataUrl = await QRCode.toDataURL(window.location.href, {
      margin: 0,
      width: 256,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    doc.addImage(qrDataUrl, 'PNG', 170, 260, 30, 30);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  const footerColor = accentColor + '1A'; // 1A = 10% opacity in hex
  doc.setFillColor(footerColor);
  doc.rect(0, 280, 210, 17, 'F');
  
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Créé sur victaure.com', 105, 285, { align: 'center' });
}