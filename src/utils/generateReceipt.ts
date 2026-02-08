import jsPDF from 'jspdf';

// Shared colors
const gold = [212, 175, 55] as const;
const dark = [26, 26, 46] as const;
const white = [255, 255, 255] as const;
const gray = [150, 150, 150] as const;

function drawHeader(doc: jsPDF, pageWidth: number, subtitle: string) {
  doc.setFillColor(...dark);
  doc.rect(0, 0, pageWidth, 297, 'F');
  doc.setFillColor(...gold);
  doc.rect(0, 0, pageWidth, 4, 'F');

  doc.setTextColor(...gold);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('ASTRO VICHAR', pageWidth / 2, 30, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...gray);
  doc.text(subtitle, pageWidth / 2, 40, { align: 'center' });

  doc.setDrawColor(...gold);
  doc.setLineWidth(0.5);
  doc.line(30, 50, pageWidth - 30, 50);
}

function drawDetails(doc: jsPDF, details: { label: string; value: string }[], startY: number, pageWidth: number) {
  const labelX = 30;
  const valueX = pageWidth - 30;
  const lineHeight = 14;

  details.forEach((item, i) => {
    const y = startY + i * lineHeight;
    if (i % 2 === 0) {
      doc.setFillColor(30, 30, 55);
      doc.rect(25, y - 6, pageWidth - 50, lineHeight, 'F');
    }
    doc.setFontSize(10);
    doc.setTextColor(...gray);
    doc.setFont('helvetica', 'normal');
    doc.text(item.label, labelX, y);
    doc.setTextColor(...white);
    doc.setFont('helvetica', 'bold');
    doc.text(item.value, valueX, y, { align: 'right' });
  });

  return startY + details.length * lineHeight;
}

function drawAmountBox(doc: jsPDF, amount: number, y: number, pageWidth: number, label = 'Amount Paid') {
  doc.setFillColor(40, 40, 65);
  doc.roundedRect(25, y - 8, pageWidth - 50, 30, 4, 4, 'F');
  doc.setDrawColor(...gold);
  doc.roundedRect(25, y - 8, pageWidth - 50, 30, 4, 4, 'S');

  doc.setFontSize(11);
  doc.setTextColor(...gray);
  doc.setFont('helvetica', 'normal');
  doc.text(label, 35, y + 7);

  doc.setFontSize(22);
  doc.setTextColor(...gold);
  doc.setFont('helvetica', 'bold');
  doc.text(`₹${amount.toLocaleString('en-IN')}`, pageWidth - 35, y + 10, { align: 'right' });
}

function drawFooter(doc: jsPDF, pageWidth: number) {
  const footerY = 260;
  doc.setDrawColor(...gold);
  doc.line(30, footerY - 10, pageWidth - 30, footerY - 10);
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.setFont('helvetica', 'normal');
  doc.text('This is a computer-generated receipt and does not require a signature.', pageWidth / 2, footerY, { align: 'center' });
  doc.text('For queries, contact astrovichar8@gmail.com', pageWidth / 2, footerY + 8, { align: 'center' });
  doc.setFillColor(...gold);
  doc.rect(0, 293, pageWidth, 4, 'F');
}

// --- Consultation Receipt ---

interface ConsultationReceiptData {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
  userName?: string;
  userEmail?: string;
}

export const generateConsultationReceipt = (data: ConsultationReceiptData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  drawHeader(doc, pageWidth, 'Consultation Payment Receipt');

  const details = [
    { label: 'Receipt Date', value: data.date },
    { label: 'Payment ID', value: data.paymentId || '—' },
    { label: 'Order ID', value: data.orderId || '—' },
    { label: 'Status', value: data.status.toUpperCase() },
    ...(data.userName ? [{ label: 'Customer', value: data.userName }] : []),
    ...(data.userEmail ? [{ label: 'Email', value: data.userEmail }] : []),
  ];

  const endY = drawDetails(doc, details, 65, pageWidth);
  drawAmountBox(doc, data.amount, endY + 15, pageWidth);
  drawFooter(doc, pageWidth);

  doc.save(`AstroVichar_Receipt_${data.paymentId || 'consultation'}.pdf`);
};

// --- Gemstone Order Receipt ---

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface GemstoneReceiptData {
  orderNumber: string;
  date: string;
  status: string;
  paymentStatus: string;
  items: OrderItem[];
  totalAmount: number;
  userName?: string;
  userEmail?: string;
}

export const generateGemstoneReceipt = (data: GemstoneReceiptData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  drawHeader(doc, pageWidth, 'Gemstone Order Receipt');

  const details = [
    { label: 'Receipt Date', value: data.date },
    { label: 'Order Number', value: `#${data.orderNumber}` },
    { label: 'Order Status', value: data.status.toUpperCase() },
    { label: 'Payment Status', value: data.paymentStatus.toUpperCase() },
    ...(data.userName ? [{ label: 'Customer', value: data.userName }] : []),
    ...(data.userEmail ? [{ label: 'Email', value: data.userEmail }] : []),
  ];

  let currentY = drawDetails(doc, details, 65, pageWidth);

  // Items table
  if (data.items.length > 0) {
    currentY += 20;

    doc.setFontSize(11);
    doc.setTextColor(...gold);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Items', 30, currentY);
    currentY += 8;

    // Table header
    doc.setFillColor(40, 40, 65);
    doc.rect(25, currentY - 5, pageWidth - 50, 12, 'F');
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.setFont('helvetica', 'bold');
    doc.text('Item', 30, currentY + 2);
    doc.text('Qty', 130, currentY + 2, { align: 'center' });
    doc.text('Price', pageWidth - 30, currentY + 2, { align: 'right' });
    currentY += 12;

    // Table rows
    data.items.forEach((item, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(30, 30, 55);
        doc.rect(25, currentY - 5, pageWidth - 50, 12, 'F');
      }

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...white);

      // Truncate long names
      const name = item.name.length > 40 ? item.name.slice(0, 37) + '...' : item.name;
      doc.text(name, 30, currentY + 2);
      doc.text(String(item.quantity), 130, currentY + 2, { align: 'center' });
      doc.setTextColor(...gold);
      doc.text(`₹${(item.price * item.quantity).toLocaleString('en-IN')}`, pageWidth - 30, currentY + 2, { align: 'right' });
      currentY += 12;
    });
  }

  drawAmountBox(doc, data.totalAmount, currentY + 15, pageWidth, 'Total Amount');
  drawFooter(doc, pageWidth);

  doc.save(`AstroVichar_Order_${data.orderNumber}.pdf`);
};
