import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * API: Order Invoice Generator
 * Generates brand-aligned PDF invoices for AuraLock purchase fulfillment.
 */
export async function GET(request: Request, context: any) {
  // Use await for params in Next.js 15+ environments
  const params = await context.params;
  const { id } = params;

  // Retrieve Full Order Context from Supabase
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: 'Order Not Found' }, { status: 404 });
  }

  // Initialize jsPDF (Standard A4)
  const doc = new jsPDF() as any;

  // Branding: AuraLock Orange
  const accentColor = [234, 88, 12];

  // Header Title
  doc.setFontSize(22);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text('AuraLock Security', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text('Precision Engineering. Autonomous Access.', 105, 28, { align: 'center' });
  doc.line(20, 35, 190, 35);

  // Metadata Section
  doc.setTextColor(0);
  doc.setFontSize(11);
  doc.text(`Invoice Reference: ${order.id}`, 20, 50);
  doc.text(`Date Issued: ${new Date(order.date).toLocaleDateString()}`, 190, 50, { align: 'right' });

  // Recipient Details
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Billed To:', 20, 70);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text([
    order.name,
    order.email,
    order.phone,
    `Address: ${order.address}`
  ], 20, 80);

  // Line Items Table using autoTable plugin
  (doc as any).autoTable({
    startY: 110,
    head: [['Description', 'Unit Price', 'Quantity', 'Total']],
    body: [[
      { content: `AuraLock Hardware: ${order.productName}`, styles: { fontStyle: 'bold' } },
      `INR ${Number(order.price).toLocaleString()}`,
      '01',
      `INR ${Number(order.price).toLocaleString()}`
    ]],
    theme: 'grid',
    headStyles: { fillColor: accentColor, textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    margin: { left: 20, right: 20 }
  });

  // Totals & Status
  const currentY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.text(`Payment Status: ${order.paymentStatus}`, 20, currentY);
  doc.text(`Final Total: INR ${Number(order.price).toLocaleString()}`, 190, currentY, { align: 'right' });

  // Legal Footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text('This is a system-generated document and serves as proof of purchase for AuraLock deployment.', 105, 280, { align: 'center' });
  doc.text('Digital Identity: AuraLock Production Node IPV-2026', 105, 285, { align: 'center' });

  // Stream data as ArrayBuffer
  const pdfArrayBuffer = doc.output('arraybuffer');

  return new Response(pdfArrayBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="AuraLock-Invoice-${order.id}.pdf"`,
      'Cache-Control': 'no-store'
    }
  });
}
