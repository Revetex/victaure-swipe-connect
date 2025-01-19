import { ExtendedJsPDF } from '../../types';
import { UserProfile } from '@/types/profile';
import { pdfStyles } from '../styles';

export const renderExperiences = (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  yPos: number
): number => {
  let currentY = yPos;

  if (profile.experiences && profile.experiences.length > 0) {
    // Section title with styling
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(15, currentY, doc.internal.pageSize.width - 30, 6, 2, 2, 'F');
    
    currentY += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text('Expérience professionnelle', 20, currentY);
    currentY += 12;

    profile.experiences.forEach((exp, index) => {
      // Company and position with modern styling
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(50, 50, 50);
      doc.text(`${exp.position}`, 20, currentY);
      
      // Company name on the right
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      const companyText = exp.company;
      const companyWidth = doc.getTextWidth(companyText);
      doc.text(companyText, doc.internal.pageSize.width - 20 - companyWidth, currentY);
      
      currentY += 6;

      // Dates with professional formatting
      if (exp.start_date) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        const dateText = exp.end_date 
          ? `${new Date(exp.start_date).toLocaleDateString('fr-FR')} - ${new Date(exp.end_date).toLocaleDateString('fr-FR')}`
          : `${new Date(exp.start_date).toLocaleDateString('fr-FR')} - Présent`;
        doc.text(dateText, 20, currentY);
        currentY += 6;
      }

      // Description with improved readability
      if (exp.description) {
        doc.setTextColor(70, 70, 70);
        const descLines = doc.splitTextToSize(exp.description, doc.internal.pageSize.width - 40);
        doc.text(descLines, 20, currentY);
        currentY += (descLines.length * 5) + 8;
      }

      // Add separator between experiences
      if (index < profile.experiences.length - 1) {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.2);
        doc.line(20, currentY, doc.internal.pageSize.width - 20, currentY);
        currentY += 8;
      }
    });
  }

  return currentY;
};