import { ExtendedJsPDF } from '../types';
import { pdfStyles } from '../styles';
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
        dark: pdfStyles.colors.text.primary.slice(1),
        light: '#0000'
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
  doc.setTextColor(pdfStyles.colors.text.muted);
  doc.text('Créé sur victaure.com', 105, 285, { align: 'center' });
};