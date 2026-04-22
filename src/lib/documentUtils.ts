import { jsPDF } from 'jspdf';

interface LineItem {
  description: string;
  quantity: number;
  price: number;
}

interface DocumentData {
  type: 'Facture' | 'Devis' | 'Reçu' | 'Contrat de Construction' | 'Contrat de Travail';
  number: string;
  date: string;
  clientName: string;
  clientAddress: string;
  items?: LineItem[];
  total?: number;
  note?: string;
  contractContent?: string;
  signerNameA?: string;
  signatureImageA?: string;
  signerNameB?: string;
  signatureImageB?: string;
}

export const generateDocumentPDF = (data: DocumentData, saveOnly: boolean = false) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const isContract = data.type.includes('Contrat');
  
  // Header
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  // Logo image
  try {
    doc.addImage('/logo.png', 'PNG', 20, 10, 35, 35);
  } catch (e) {
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('S.C.M. SARL', 20, 20);
  }
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('RCCM : CD/KNM/RCCM/ 24-B-01256', 90, 15);
  doc.text('IDNAT : 01-F4200-N55523N', 90, 22);
  doc.text('N°IMPÔT : A2442 173S', 90, 29);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Construction Management & Enterprise', 20, 28);
  doc.text('Kinshasa, RD Congo', 20, 33);

  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text(data.type.toUpperCase(), pageWidth - 20, 25, { align: 'right' });
  
  // Decorative line
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.line(20, 45, pageWidth - 20, 45);
  
  // Document Info
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Réf: ${data.number}`, 20, 55);
  doc.text(`Date: ${data.date}`, 20, 60);
  
  // Client/Party Info
  doc.text(isContract ? 'PARTIE CONCERNÉE:' : 'DESTINATAIRE:', 120, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(data.clientName, 120, 60);
  doc.text(data.clientAddress, 120, 65);
  
  let y = 80;

  if (isContract && data.contractContent) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(data.contractContent, pageWidth - 40);
    doc.text(splitText, 20, y);
    y += (splitText.length * 6) + 20;

    // Signatures
    if (y > 250) {
      doc.addPage();
      y = 40;
    }

    doc.setFont('helvetica', 'bold');
    
    // Party A Signature
    doc.text(data.signerNameA?.toUpperCase() || 'LE DIRECTEUR GÉNÉRAL (SCM SARL)', 20, y);
    
    // Party B Signature
    doc.text(data.signerNameB?.toUpperCase() || 'SIGNATURE PARTIE B', 120, y);

    y += 10;
    
    // Signature Image A
    if (data.signatureImageA) {
      try {
        doc.addImage(data.signatureImageA, 'PNG', 20, y, 40, 20);
      } catch (e) {
        doc.rect(20, y, 40, 20);
        doc.text('SCEAU / SIGNATURE A', 22, y + 10);
      }
    } else {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.text('(Signature DG)', 20, y + 10);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
    }

    // Signature Image B
    if (data.signatureImageB) {
      try {
        doc.addImage(data.signatureImageB, 'PNG', 120, y, 40, 20);
      } catch (e) {
        doc.rect(120, y, 40, 20);
        doc.text('SCEAU / SIGNATURE B', 122, y + 10);
      }
    } else {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.text('(Veuillez signer ici)', 120, y + 10);
    }
  } else if (!isContract && data.items && data.total !== undefined) {
    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(20, y, pageWidth - 40, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 25, y + 6);
    doc.text('Qté', 110, y + 6);
    doc.text('Prix Unit.', 135, y + 6);
    doc.text('Total', 175, y + 6);
    
    // Table Content
    y += 12;
    doc.setFont('helvetica', 'normal');
    data.items.forEach((item) => {
      doc.text(item.description, 25, y);
      doc.text(item.quantity.toString(), 110, y);
      doc.text(`$${item.price.toLocaleString()}`, 135, y);
      doc.text(`$${(item.quantity * item.price).toLocaleString()}`, 175, y);
      y += 10;
    });
    
    // Total
    y += 5;
    doc.setDrawColor(226, 232, 240);
    doc.line(20, y, pageWidth - 20, y);
    y += 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 135, y);
    doc.text(`$${data.total.toLocaleString()}`, 175, y);
  }
  
  // Footer / Notes
  if (data.note) {
    y += 20;
    if (y > 270) { doc.addPage(); y = 40; }
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Notes / Conditions:', 20, y);
    doc.text(data.note, 20, y + 5);
  }
  
  y = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Généré dynamiquement par le système de gestion S.C.M SARL', pageWidth / 2, y, { align: 'center' });
  
  if (saveOnly) {
    return doc.output('datauristring');
  }
  doc.save(`${data.type.toLowerCase()}_${data.number}.pdf`);
  return doc.output('datauristring');
};
