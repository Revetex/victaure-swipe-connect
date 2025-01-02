import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import type { UserProfile } from '@/types/profile';

const pdfStyles = {
  colors: {
    primary: '#9b87f5',
    secondary: '#7E69AB',
    background: '#FFFFFF',
    text: {
      primary: '#1A1F2C',
      secondary: '#555555',
      muted: '#8E9196'
    },
    accent: '#E5DEFF'
  },
  margins: {
    top: 20,
    left: 20,
    right: 20
  },
  fonts: {
    header: {
      size: 24,
      style: 'bold'
    },
    subheader: {
      size: 16,
      style: 'normal'
    },
    body: {
      size: 10,
      style: 'normal'
    }
  }
};

export const generateCVPDF = async (profile: UserProfile) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Add gradient background
  doc.setFillColor(pdfStyles.colors.background);
  doc.rect(0, 0, 210, 297, 'F');

  // Add decorative header
  doc.setFillColor(pdfStyles.colors.primary);
  const headerHeight = 50;
  doc.rect(0, 0, 210, headerHeight, 'F');

  // Add subtle pattern to header
  for (let i = 0; i < headerHeight; i += 2) {
    doc.setFillColor(pdfStyles.colors.secondary);
    doc.setGlobalAlpha(0.1);
    doc.rect(0, i, 210, 1, 'F');
    doc.setGlobalAlpha(1);
  }

  let yPos = pdfStyles.margins.top + 15;

  // Header with name and role
  doc.setTextColor(pdfStyles.colors.background);
  doc.setFontSize(pdfStyles.fonts.header.size);
  doc.setFont('helvetica', pdfStyles.fonts.header.style);
  doc.text(profile.full_name || '', pdfStyles.margins.left, yPos);

  yPos += 10;
  doc.setFontSize(pdfStyles.fonts.subheader.size);
  doc.setFont('helvetica', pdfStyles.fonts.subheader.style);
  if (profile.role) {
    doc.text(profile.role, pdfStyles.margins.left, yPos);
    yPos += 10;
  }

  // Contact Information
  yPos += 10;
  doc.setTextColor(pdfStyles.colors.text.primary);
  doc.setFontSize(pdfStyles.fonts.body.size);
  doc.setFont('helvetica', pdfStyles.fonts.body.style);

  const contactInfo = [];
  if (profile.email) contactInfo.push(`Email: ${profile.email}`);
  if (profile.phone) contactInfo.push(`Téléphone: ${profile.phone}`);
  if (profile.city) {
    const location = [profile.city, profile.state, profile.country].filter(Boolean).join(', ');
    contactInfo.push(`Localisation: ${location}`);
  }

  contactInfo.forEach(info => {
    doc.text(info, pdfStyles.margins.left, yPos);
    yPos += 6;
  });

  // Bio section with accent background
  if (profile.bio) {
    yPos += 10;
    doc.setFillColor(pdfStyles.colors.accent);
    doc.setGlobalAlpha(0.2);
    doc.roundedRect(pdfStyles.margins.left - 5, yPos - 5, 180, 30, 3, 3, 'F');
    doc.setGlobalAlpha(1);

    doc.setFontSize(pdfStyles.fonts.subheader.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(pdfStyles.colors.text.primary);
    doc.text('À propos', pdfStyles.margins.left, yPos);
    
    yPos += 8;
    doc.setFontSize(pdfStyles.fonts.body.size);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(pdfStyles.colors.text.secondary);
    const bioLines = doc.splitTextToSize(profile.bio, 170);
    doc.text(bioLines, pdfStyles.margins.left, yPos);
    yPos += (bioLines.length * 5) + 15;
  }

  // Skills with visual enhancement
  if (profile.skills && profile.skills.length > 0) {
    doc.setFillColor(pdfStyles.colors.accent);
    doc.setGlobalAlpha(0.1);
    doc.roundedRect(pdfStyles.margins.left - 5, yPos - 5, 180, 20, 3, 3, 'F');
    doc.setGlobalAlpha(1);

    doc.setFontSize(pdfStyles.fonts.subheader.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(pdfStyles.colors.text.primary);
    doc.text('Compétences', pdfStyles.margins.left, yPos);
    
    yPos += 8;
    doc.setFontSize(pdfStyles.fonts.body.size);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(pdfStyles.colors.text.secondary);
    
    const skillsPerRow = 4;
    const skillChunks = [];
    for (let i = 0; i < profile.skills.length; i += skillsPerRow) {
      skillChunks.push(profile.skills.slice(i, i + skillsPerRow));
    }

    skillChunks.forEach(chunk => {
      const skillsText = chunk.join(' • ');
      doc.text(skillsText, pdfStyles.margins.left, yPos);
      yPos += 6;
    });
    yPos += 10;
  }

  // Experience section with timeline design
  if (profile.experiences && profile.experiences.length > 0) {
    doc.setFontSize(pdfStyles.fonts.subheader.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(pdfStyles.colors.text.primary);
    doc.text('Expérience professionnelle', pdfStyles.margins.left, yPos);
    yPos += 8;

    profile.experiences.forEach((exp, index) => {
      // Timeline dot
      doc.setFillColor(pdfStyles.colors.primary);
      doc.circle(pdfStyles.margins.left - 2, yPos - 2, 1, 'F');
      
      // Vertical timeline line
      if (index < profile.experiences!.length - 1) {
        doc.setDrawColor(pdfStyles.colors.primary);
        doc.setLineWidth(0.2);
        doc.line(pdfStyles.margins.left - 2, yPos, pdfStyles.margins.left - 2, yPos + 20);
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${exp.position} - ${exp.company}`, pdfStyles.margins.left + 2, yPos);
      yPos += 6;

      if (exp.start_date) {
        doc.setFontSize(pdfStyles.fonts.body.size);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(pdfStyles.colors.text.muted);
        const dateText = exp.end_date 
          ? `${new Date(exp.start_date).toLocaleDateString('fr-FR')} - ${new Date(exp.end_date).toLocaleDateString('fr-FR')}`
          : `${new Date(exp.start_date).toLocaleDateString('fr-FR')} - Présent`;
        doc.text(dateText, pdfStyles.margins.left + 2, yPos);
        yPos += 6;
      }

      if (exp.description) {
        doc.setTextColor(pdfStyles.colors.text.secondary);
        const descLines = doc.splitTextToSize(exp.description, 165);
        doc.text(descLines, pdfStyles.margins.left + 2, yPos);
        yPos += (descLines.length * 5) + 10;
      }
    });
  }

  // Education section with modern design
  if (profile.education && profile.education.length > 0) {
    yPos += 10;
    doc.setFillColor(pdfStyles.colors.accent);
    doc.setGlobalAlpha(0.1);
    doc.roundedRect(pdfStyles.margins.left - 5, yPos - 5, 180, 15 + (profile.education.length * 25), 3, 3, 'F');
    doc.setGlobalAlpha(1);

    doc.setFontSize(pdfStyles.fonts.subheader.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(pdfStyles.colors.text.primary);
    doc.text('Formation', pdfStyles.margins.left, yPos);
    yPos += 10;

    profile.education.forEach(edu => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${edu.degree}${edu.field_of_study ? ` - ${edu.field_of_study}` : ''}`, pdfStyles.margins.left, yPos);
      yPos += 6;
      
      doc.setFontSize(pdfStyles.fonts.body.size);
      doc.setFont('helvetica', 'normal');
      doc.text(edu.school_name, pdfStyles.margins.left, yPos);
      yPos += 6;

      if (edu.start_date) {
        doc.setTextColor(pdfStyles.colors.text.muted);
        const dateText = edu.end_date 
          ? `${new Date(edu.start_date).toLocaleDateString('fr-FR')} - ${new Date(edu.end_date).toLocaleDateString('fr-FR')}`
          : `${new Date(edu.start_date).toLocaleDateString('fr-FR')} - Présent`;
        doc.text(dateText, pdfStyles.margins.left, yPos);
        yPos += 6;
      }

      if (edu.description) {
        doc.setTextColor(pdfStyles.colors.text.secondary);
        const descLines = doc.splitTextToSize(edu.description, 165);
        doc.text(descLines, pdfStyles.margins.left, yPos);
        yPos += (descLines.length * 5) + 8;
      }
    });
  }

  // QR Code at the bottom
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

  // Footer with subtle design
  doc.setFillColor(pdfStyles.colors.accent);
  doc.setGlobalAlpha(0.1);
  doc.rect(0, 280, 210, 17, 'F');
  doc.setGlobalAlpha(1);
  
  doc.setFontSize(8);
  doc.setTextColor(pdfStyles.colors.text.muted);
  doc.text('Créé sur victaure.com', 105, 285, { align: 'center' });

  // Save the PDF
  doc.save(`cv-${profile.full_name?.toLowerCase().replace(/\s+/g, '-') || 'professionnel'}.pdf`);
};