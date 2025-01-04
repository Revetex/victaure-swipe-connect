import { generateVCardPDF } from './pdf/vcard';
import { generateCVPDF } from './pdf/cv';
import { generateBusinessCardPDF } from './pdf/businessCard';

export { 
  generateVCardPDF as generatePDF,
  generateCVPDF,
  generateBusinessCardPDF as generateBusinessPDF
};