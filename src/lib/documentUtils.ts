import { jsPDF } from 'jspdf';

interface LineItem {
  description: string;
  quantity: number;
  price: number;
}

interface DocumentData {
  type: 'Facture' | 'Devis' | 'Reçu';
  number: string;
  date: string;
  clientName: string;
  clientAddress: string;
  items: LineItem[];
  total: number;
  note?: string;
}

export const generateDocumentPDF = (data: DocumentData, saveOnly: boolean = false) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('S.C.M SARL', 20, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Construction Management & Enterprise', 20, 28);
  doc.text('Kinshasa, RD Congo', 20, 33);

  doc.setFontSize(20);
  doc.text(data.type.toUpperCase(), pageWidth - 20, 25, { align: 'right' });
  
  // Document Info
  doc.setTextColor(30, 41, 59); // slate-800
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Numéro: ${data.number}`, 20, 55);
  doc.text(`Date: ${data.date}`, 20, 60);
  
  // Client Info
  doc.text('DESTINATAIRE:', 120, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(data.clientName, 120, 60);
  doc.text(data.clientAddress, 120, 65);
  
  // Table Header
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(20, 80, pageWidth - 40, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('Description', 25, 86);
  doc.text('Qté', 110, 86);
  doc.text('Prix Unit.', 135, 86);
  doc.text('Total', 175, 86);
  
  // Table Content
  let y = 98;
  doc.setFont('helvetica', 'normal');
  data.items.forEach((item) => {
    doc.text(item.description, 25, y);
    doc.text(item.quantity.toString(), 110, y);
    doc.text(`$${item.price.toLocaleString()}`, 135, y);
    doc.text(`$${(item.quantity * item.price).toLocaleString()}`, 175, y);
    y += 10;
  });
  
  // Horizontal line
  doc.setDrawColor(226, 232, 240);
  doc.line(20, y, pageWidth - 20, y);
  
  // Total
  y += 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL:', 135, y);
  doc.text(`$${data.total.toLocaleString()}`, 175, y);
  
  // Footer / Notes
  if (data.note) {
    y += 20;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Notes:', 20, y);
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
