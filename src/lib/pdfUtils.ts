import jsPDF from 'jspdf';

export const generateEmployeePDF = async (employee: any, siteName: string) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Colors
  const primaryColor = [37, 99, 235]; // blue-600
  const secondaryColor = [71, 85, 105]; // slate-600

  // Header Background
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(0, 0, 210, 60, 'F');

  // Company Logo
  try {
    doc.addImage('/logo.png', 'PNG', 15, 10, 25, 25);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('S.C.M. SARL', 15, 42);
  } catch (e) {
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('S.C.M. SARL', 20, 25);
  }
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('RCCM: CD/KNM/RCCM/24-B-01256 | IDNAT: 01-F4200-N55523N | N°IMPÔT: A2442 173S', 15, 47);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('FICHE D\'IDENTITÉ PROFESSIONNELLE', 15, 54);

  // Profile Image placeholder or actual image
  try {
    if (employee.photo && typeof employee.photo === 'string') {
      // Adding a circle or rounded rect for image
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.roundedRect(150, 15, 40, 40, 5, 5, 'D');
      
      let format = 'JPEG';
      if (employee.photo.includes('image/png')) format = 'PNG';
      else if (employee.photo.includes('image/webp')) format = 'WEBP';
      
      // Attempt to clean the data URL if it contains prefixes that jsPDF might struggle with
      // but usually addImage handles base64 data URLs directly.
      doc.addImage(employee.photo, format, 151, 16, 38, 38, undefined, 'FAST');
    }
  } catch (e) {
    console.warn('Could not add image to PDF', e);
    // Draw a placeholder circle if image fails
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    doc.circle(170, 35, 15, 'D');
    doc.setFontSize(8);
    doc.text('PHOTO', 170, 35, { align: 'center', baseline: 'middle' });
  }

  // Divider
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(1);
  doc.line(20, 60, 190, 60);

  // Information Grid - Two Column Layout
  let yPos = 80;

  const addInfoField = (label: string, value: string, xPos: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(label.toUpperCase(), xPos, yPos);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(value || 'N/A', xPos, yPos + 6);
  };

  addInfoField('Nom Complet', employee.fullName, 20);
  addInfoField('Matricule', employee.id, 110);
  
  yPos += 18;
  addInfoField('Genre', employee.gender === 'M' ? 'Masculin' : 'Féminin', 20);
  addInfoField('Date de Naissance', employee.birthDate, 110);

  yPos += 18;
  addInfoField('Âge', `${employee.age} ans`, 20);
  addInfoField('Poste / Fonction', employee.position, 110);

  yPos += 18;
  addInfoField('Date d\'Admission', employee.admissionDate, 20);
  addInfoField('Téléphone', employee.phone, 110);

  yPos += 18;
  addInfoField('Adresse Email', employee.email, 20);
  addInfoField('Lieu de Résidence', employee.address, 110);

  yPos += 18;
  addInfoField('Chantier Assigné', siteName, 20);
  
  // Service Card Photo if exists
  if (employee.serviceCardPhoto) {
     yPos += 20;
     doc.setFont('helvetica', 'bold');
     doc.setFontSize(8);
     doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
     doc.text('APERÇU CARTE DE SERVICE', 20, yPos);
     try {
       let format = 'JPEG';
       if (employee.serviceCardPhoto.includes('image/png')) format = 'PNG';
       doc.addImage(employee.serviceCardPhoto, format, 20, yPos + 4, 60, 35);
     } catch (e) {
       console.warn('Could not add card image to PDF', e);
     }
  }

  // Financial Section
  yPos = 220;
  doc.setFillColor(241, 245, 249); // slate-100
  doc.roundedRect(20, yPos, 170, 35, 3, 3, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Situation Salariale', 30, yPos + 10);
  
  doc.setFontSize(9);
  doc.text('Salaire de Base:', 30, yPos + 20);
  doc.setFont('helvetica', 'normal');
  doc.text(`$${employee.salaryTotal.toLocaleString()}`, 70, yPos + 20);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Déjà Payé:', 110, yPos + 20);
  doc.setFont('helvetica', 'normal');
  doc.text(`$${employee.salaryPaid.toLocaleString()}`, 140, yPos + 20);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Document généré par le système de gestion S.C.M SARL. Document officiel à usage interne.', 105, 285, { align: 'center' });

  // Save the PDF
  doc.save(`Fiche_Employe_${employee.id}.pdf`);
};

export const generateEmployeeListPDF = async (employees: any[]) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [37, 99, 235]; // blue-600
  const secondaryColor = [71, 85, 105]; // slate-600
  const headerBg = [15, 23, 42]; // slate-900

  const drawHeader = () => {
    // Header background
    doc.setFillColor(headerBg[0], headerBg[1], headerBg[2]);
    doc.rect(0, 0, 210, 45, 'F');
    
    // Abstract shapes for elegance
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2], 0.1);
    doc.circle(200, 0, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('ANNUAIRE DU PERSONNEL', 105, 18, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('S.C.M. SARL | SOLUTIONS DE CONSTRUCTION ET MAINTENANCE', 105, 25, { align: 'center' });
    
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.3);
    doc.line(80, 28, 130, 28);
    
    doc.setFontSize(8);
    doc.text('RCCM: CD/KNM/RCCM/24-B-01256 | IDNAT: 01-F4200-N55523N', 105, 34, { align: 'center' });
    
    doc.setFillColor(255, 255, 255, 0.1);
    doc.roundedRect(75, 37, 60, 6, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text(`Document officiel généré le ${new Date().toLocaleDateString('fr-FR')} | Effectif: ${employees.length} agents`, 105, 41, { align: 'center' });
  };

  const drawTableHead = (y: number) => {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(10, y, 190, 10, 2, 2, 'F');
    
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('PORTRAIT', 18, y + 6.5);
    doc.text('INFORMATIONS AGENT', 45, y + 6.5);
    doc.text('MATRICULE', 125, y + 6.5);
    doc.text('GENRE', 175, y + 6.5, { align: 'center' });
  };

  drawHeader();
  let yPos = 55;
  drawTableHead(yPos);
  yPos += 14;

  for (let i = 0; i < employees.length; i++) {
    const emp = employees[i];
    
    // Check if we need a new page
    if (yPos > 265) {
      doc.addPage();
      drawHeader();
      yPos = 55;
      drawTableHead(yPos);
      yPos += 14;
    }

    // Row zebra stripes
    if (i % 2 === 0) {
      doc.setFillColor(250, 251, 253);
      doc.roundedRect(10, yPos - 2, 190, 22, 1, 1, 'F');
    }

    // Photo (Larger: 18x18 mm)
    try {
      if (emp.photo) {
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.2);
        doc.roundedRect(15, yPos, 18, 18, 2, 2, 'D'); // Border for photo
        
        let format = 'JPEG';
        if (emp.photo.includes('image/png')) format = 'PNG';
        else if (emp.photo.includes('image/webp')) format = 'WEBP';
        
        doc.addImage(emp.photo, format, 15.5, yPos + 0.5, 17, 17, undefined, 'FAST');
      }
    } catch (e) {
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(15, yPos, 18, 18, 2, 2, 'D');
      doc.setFontSize(6);
      doc.setTextColor(148, 163, 184);
      doc.text('NO PHOTO', 24, yPos + 10, { align: 'center' });
    }

    // Name and Position
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(emp.fullName || 'N/A', 45, yPos + 7);
    
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]); // blue-600
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text((emp.position || 'SALARIÉ').toUpperCase(), 45, yPos + 12);
    
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(emp.email || 'Pas d\'email renseigné', 45, yPos + 16);

    // Matricule
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(emp.id || 'N/A', 125, yPos + 10);
    
    // Gender Tag
    const genderLabel = emp.gender === 'F' ? 'FÉMININ' : 'MASCULIN';
    const genderColor = emp.gender === 'F' ? [219, 39, 119] : [37, 99, 235]; // pink vs blue
    
    doc.setDrawColor(genderColor[0], genderColor[1], genderColor[2]);
    doc.setFillColor(genderColor[0], genderColor[1], genderColor[2], 0.05);
    doc.roundedRect(165, yPos + 6, 20, 6, 1, 1, 'FD');
    
    doc.setTextColor(genderColor[0], genderColor[1], genderColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.text(genderLabel, 175, yPos + 10, { align: 'center' });

    yPos += 24; // Row spacing
  }

  // Footer on each page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.5);
    doc.line(10, 285, 200, 285);
    
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`S.C.M SARL Management System | Page ${i} sur ${pageCount}`, 15, 292);
    doc.text('Confidence: Interne / Strictement Privé', 195, 292, { align: 'right' });
  }

  doc.save(`Annuaire_SCM_SARL_${new Date().toISOString().split('T')[0]}.pdf`);
};
