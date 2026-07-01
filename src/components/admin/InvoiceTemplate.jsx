import React, { useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const InvoiceTemplate = ({ order, onComplete }) => {
  const printRef = useRef();

  useEffect(() => {
    const generatePDF = async () => {
      if (!printRef.current || !order) return;
      
      try {
        const canvas = await html2canvas(printRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Invoice_${order.id}.pdf`);
      } catch (error) {
        console.error("Error generating PDF", error);
      } finally {
        if (onComplete) onComplete();
      }
    };

    generatePDF();
  }, [order, onComplete]);

  return (
    <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
      <div 
        ref={printRef} 
        style={{ 
          width: '800px', 
          padding: '40px', 
          background: 'white', 
          color: 'black',
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '20px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', textTransform: 'uppercase' }}>Basha Collectives</h1>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>Luxury Assets & Apparel</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ margin: 0, fontSize: '24px', color: '#333' }}>INVOICE</h2>
            <p style={{ margin: '5px 0 0 0' }}>Order ID: {order.id}</p>
            <p style={{ margin: '5px 0 0 0' }}>Date: {order.date}</p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#666' }}>Bill To:</h3>
            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{order.customer}</p>
            <p style={{ margin: '0 0 5px 0' }}>Payment Method: {order.payment}</p>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
          <thead>
            <tr style={{ background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Item Description</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Quantity</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Price</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {/* Mock Line Items */}
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>Luxury Asset Item</td>
              <td style={{ padding: '12px', textAlign: 'right' }}>1</td>
              <td style={{ padding: '12px', textAlign: 'right' }}>₹{order.total.toFixed(2)}</td>
              <td style={{ padding: '12px', textAlign: 'right' }}>₹{order.total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Subtotal:</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Tax (0%):</span>
              <span>₹0.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #000', paddingTop: '10px', fontWeight: 'bold', fontSize: '18px' }}>
              <span>Total:</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '60px', textAlign: 'center', color: '#666', fontSize: '12px' }}>
          <p>Thank you for shopping with Basha Collectives.</p>
          <p>For any queries, contact bashacollectives@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
