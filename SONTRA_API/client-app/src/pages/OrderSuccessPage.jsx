import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useApp } from '../AppContext';
import { CheckCircle, QrCode, Home, Info, AlertTriangle } from 'lucide-react';

export default function OrderSuccessPage() {
  const { t, formatPrice } = useApp();
  const location = useLocation();

  // Parse query params
  const params = new URLSearchParams(location.search);
  const code = params.get('code') || 'ST-000000';
  const method = params.get('method') || 'COD';
  const amount = parseInt(params.get('amount') || '0');
  const qrCodeUrl = decodeURIComponent(params.get('qr') || '');
  const paymentUrl = decodeURIComponent(params.get('url') || '');

  return (
    <div className="container" style={{ padding: '80px 24px', maxWidth: '600px' }}>
      <div 
        style={{ 
          background: '#fff', 
          border: '1px solid var(--border-color)', 
          borderRadius: 'var(--radius)', 
          padding: '40px',
          boxShadow: 'var(--shadow)',
          textAlign: 'center'
        }}
      >
        <CheckCircle size={64} color="var(--primary)" style={{ margin: '0 auto 20px' }} />
        
        <h2 style={{ fontSize: '28px', color: 'var(--primary-dark)', marginBottom: '10px' }}>
          {t("Đặt hàng thành công!", "Order Placed Successfully!")}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
          {t("Cảm ơn bạn đã tin chọn các dòng trà thảo mộc của Son Tra Herbal Tea.", "Thank you for selecting Son Tra Herbal Tea blends.")}
        </p>

        {/* Order Info Block */}
        <div 
          style={{ 
            background: 'var(--bg-cream)', 
            borderRadius: 'var(--radius)', 
            padding: '24px', 
            textAlign: 'left', 
            marginBottom: '30px',
            fontSize: '15px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <div className="flex-between">
            <strong>{t("Mã đơn hàng:", "Order Code:")}</strong>
            <span style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '16px' }}>{code}</span>
          </div>
          <div className="flex-between">
            <strong>{t("Phương thức thanh toán:", "Payment Method:")}</strong>
            <span>{method}</span>
          </div>
          <div className="flex-between" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '5px' }}>
            <strong>{t("Tổng số tiền:", "Total Amount:")}</strong>
            <span style={{ fontWeight: '700', color: 'var(--secondary)', fontSize: '18px' }}>
              {formatPrice(amount, amount / 25000)}
            </span>
          </div>
        </div>

        {/* Dynamic Payment Details */}
        {method === 'VietQR' && qrCodeUrl && (
          <div className="vietqr-container" style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: 'var(--primary-dark)', fontWeight: '600' }}>
              <QrCode size={18} />
              <span>{t("Quét mã VietQR để thanh toán", "Scan VietQR Code to Pay")}</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {t("Mở ứng dụng ngân hàng và quét mã dưới đây để chuyển khoản tự động.", "Open your banking app and scan this QR code to complete transfer.")}
            </p>
            
            <img src={qrCodeUrl} alt="VietQR Payment Code" className="qr-image" />

            <div style={{ fontSize: '13px', textAlign: 'left', background: '#f9f9f9', padding: '15px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p><strong>{t("Ngân hàng:", "Bank Name:")}</strong> Vietinbank (970415)</p>
              <p><strong>{t("Số tài khoản:", "Account Number:")}</strong> 113113113</p>
              <p><strong>{t("Tên tài khoản:", "Account Name:")}</strong> SON TRA HERBAL TEA</p>
              <p><strong>{t("Nội dung chuyển khoản:", "Transfer Message:")}</strong> <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>THANH TOAN DON HANG {code}</span></p>
            </div>
          </div>
        )}

        {method === 'COD' && (
          <div 
            style={{ 
              background: '#fef3c7', 
              color: '#d97706', 
              padding: '16px', 
              borderRadius: '8px', 
              fontSize: '13px', 
              textAlign: 'left', 
              display: 'flex', 
              gap: '10px', 
              marginBottom: '30px' 
            }}
          >
            <Info size={20} style={{ flexShrink: 0 }} />
            <p>
              {t(
                "Đơn hàng của bạn sẽ được chuẩn bị và giao trong vòng 2-4 ngày làm việc. Vui lòng giữ liên lạc điện thoại và chuẩn bị sẵn số tiền mặt tương ứng để thanh toán khi shipper giao trà.",
                "Your order will be shipped within 2-4 business days. Please keep your phone reachable and prepare the cash amount to pay the shipper upon arrival."
              )}
            </p>
          </div>
        )}

        {method === 'MoMo' && (
          <div style={{ marginBottom: '30px' }}>
            <p style={{ fontSize: '14px', marginBottom: '15px' }}>
              {t("Vui lòng hoàn tất giao dịch ví MoMo của bạn qua nút liên kết dưới đây:", "Please complete your MoMo wallet transaction via the button below:")}
            </p>
            <a 
              href={paymentUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary"
              style={{ background: '#a50064', display: 'inline-flex', width: '100%', padding: '12px 0', fontSize: '15px' }}
            >
              {t("Thanh toán MoMo (Mô phỏng)", "Pay with MoMo (Simulation)")}
            </a>
            <div style={{ marginTop: '10px', display: 'flex', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'left' }}>
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <p>{t("Đây là giao dịch mô phỏng phục vụ đánh giá dự án môn học.", "This is a simulated transaction for academic project evaluation purposes.")}</p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-outline" style={{ display: 'flex', gap: '8px' }}>
            <Home size={16} /> {t("Quay lại Trang chủ", "Back to Home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
