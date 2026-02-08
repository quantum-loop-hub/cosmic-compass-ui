import jsPDF from 'jspdf';

interface ReceiptData {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
  userName?: string;
  userEmail?: string;
}

export const generateConsultationReceipt = (data: ReceiptData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Colors
  const gold = [212, 175, 55] as const;
  const dark = [26, 26, 46] as const;
  const white = [255, 255, 255] as const;
  const gray = [150, 150, 150] as const;

  // Background
  doc.setFillColor(...dark);
  doc.rect(0, 0, pageWidth, 297, 'F');

  // Gold accent bar
  doc.setFillColor(...gold);
  doc.rect(0, 0, pageWidth, 4, 'F');

  // Header
  doc.setTextColor(...gold);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('ASTRO VICHAR', pageWidth / 2, 30, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...gray);
  doc.text('Consultation Payment Receipt', pageWidth / 2, 40, { align: 'center' });

  // Divider
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.5);
  doc.line(30, 50, pageWidth - 30, 50);

  // Receipt details
  const startY = 65;
  const labelX = 30;
  const valueX = pageWidth - 30;
  const lineHeight = 14;

  const details = [
    { label: 'Receipt Date', value: data.date },
    { label: 'Payment ID', value: data.paymentId || '—' },
    { label: 'Order ID', value: data.orderId || '—' },
    { label: 'Status', value: data.status.toUpperCase() },
    ...(data.userName ? [{ label: 'Customer', value: data.userName }] : []),
    ...(data.userEmail ? [{ label: 'Email', value: data.userEmail }] : []),
  ];

  details.forEach((item, i) => {
    const y = startY + i * lineHeight;

    // Alternate row background
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

  // Amount box
  const amountY = startY + details.length * lineHeight + 15;
  doc.setFillColor(40, 40, 65);
  doc.roundedRect(25, amountY - 8, pageWidth - 50, 30, 4, 4, 'F');
  doc.setDrawColor(...gold);
  doc.roundedRect(25, amountY - 8, pageWidth - 50, 30, 4, 4, 'S');

  doc.setFontSize(11);
  doc.setTextColor(...gray);
  doc.setFont('helvetica', 'normal');
  doc.text('Amount Paid', labelX + 5, amountY + 7);

  doc.setFontSize(22);
  doc.setTextColor(...gold);
  doc.setFont('helvetica', 'bold');
  doc.text(`₹${data.amount.toLocaleString('en-IN')}`, valueX - 5, amountY + 10, { align: 'right' });

  // Footer
  const footerY = 260;
  doc.setDrawColor(...gold);
  doc.line(30, footerY - 10, pageWidth - 30, footerY - 10);

  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.setFont('helvetica', 'normal');
  doc.text('This is a computer-generated receipt and does not require a signature.', pageWidth / 2, footerY, { align: 'center' });
  doc.text('For queries, contact astrovichar8@gmail.com', pageWidth / 2, footerY + 8, { align: 'center' });

  // Gold accent bar bottom
  doc.setFillColor(...gold);
  doc.rect(0, 293, pageWidth, 4, 'F');

  // Save
  doc.save(`AstroVichar_Receipt_${data.paymentId || 'consultation'}.pdf`);
};
