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
