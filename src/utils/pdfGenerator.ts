import { generateCV } from './pdf/cv';
import { generateVCard } from './pdf/vcard';
import { generateBusinessCard } from './pdf/businessCard';

export { 
  generateVCard as generatePDF,
  generateCV as generateCVPDF,
  generateBusinessCard as generateBusinessPDF
};