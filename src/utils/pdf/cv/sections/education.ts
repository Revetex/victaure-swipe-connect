import { ExtendedJsPDF } from '../../types';
import { UserProfile } from '@/types/profile';
import { pdfStyles } from '../styles';

export const renderEducation = (
  doc: ExtendedJsPDF,
  profile: UserProfile,
  yPos: number
): number => {
  let currentY = yPos;

  if (profile.education && profile.education.length > 0) {
    // Section title with styling
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(15, currentY, doc.internal.pageSize.width - 30, 6, 2, 2, 'F');
    
    currentY += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text('Formation', 20, currentY);
    currentY += 12;

    profile.education.forEach((edu, index) => {
      // Degree and field with modern styling
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(50, 50, 50);
      doc.text(`${edu.degree}${edu.field_of_study ? ` - ${edu.field_of_study}` : ''}`, 20, currentY);
      currentY += 6;
      
      // School name with professional formatting
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(edu.school_name, 20, currentY);
      currentY += 6;

      // Dates with clean formatting
      if (edu.start_date) {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        const dateText = edu.end_date 
          ? `${new Date(edu.start_date).toLocaleDateString('fr-FR')} - ${new Date(edu.end_date).toLocaleDateString('fr-FR')}`
          : `${new Date(edu.start_date).toLocaleDateString('fr-FR')} - Présent`;
        doc.text(dateText, 20, currentY);
        currentY += 6;
      }

      // Description with improved readability
      if (edu.description) {
        doc.setTextColor(70, 70, 70);
        const descLines = doc.splitTextToSize(edu.description, doc.internal.pageSize.width - 40);
        doc.text(descLines, 20, currentY);
        currentY += (descLines.length * 5) + 4;
      }

      // Add separator between education entries
      if (index < profile.education.length - 1) {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.2);
        doc.line(20, currentY + 4, doc.internal.pageSize.width - 20, currentY + 4);
        currentY += 12;
      }
    });
  }

  return currentY;
};