import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, Truck, ShieldAlert } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, clearCart, formatPrice, t, user } = useApp();
  const navigate = useNavigate();

  // Form states
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [specificAddress, setSpecificAddress] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState('COD'); // COD, VietQR, MoMo
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  
  const [shippingFeeVND, setShippingFeeVND] = useState(30000);
  const [shippingFeeUSD, setShippingFeeUSD] = useState(1.20);
  
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [acceptPolicy, setAcceptPolicy] = useState(false);

  // Auto-fill if user is logged in
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Recalculate shipping fee when province changes
  useEffect(() => {
    if (province) {
      axios.post('/api/orders/shipping-fee', { province })
        .then(res => {
          setShippingFeeVND(res.data.shippingFeeVND);
          setShippingFeeUSD(res.data.shippingFeeUSD);
        })
        .catch(err => console.error('Lỗi tính phí vận chuyển:', err));
    }
  }, [province]);

  const getSubTotal = () => {
    let vnd = 0;
    let usd = 0;
    cart.forEach(item => {
      vnd += item.priceVND * item.quantity;
      usd += item.priceUSD * item.quantity;
    });
    return { vnd, usd };
  };

  const subtotal = getSubTotal();

  // Validate coupon
  const handleApplyCoupon = () => {
    if (!couponCode) return;
    
    // Simulate/verify coupon
    if (couponCode.toUpperCase() === 'SONTRAFREE') {
      if (subtotal.vnd >= 100000) {
        setAppliedCoupon({
          code: 'SONTRAFREE',
          value: 20000
        });
        alert(t("Áp dụng mã giảm giá thành công! Giảm 20.000đ.", "Promo code applied successfully! 20,000 VND discount."));
      } else {
        alert(t("Đơn hàng tối thiểu 100.000đ để áp dụng mã này.", "Min order of 100k required for this coupon."));
      }
    } else {
      alert(t("Mã giảm giá không hợp lệ hoặc đã hết hạn.", "Invalid or expired coupon code."));
    }
  };

  const getDiscountVND = () => {
    return appliedCoupon ? appliedCoupon.value : 0;
  };
  const getDiscountUSD = () => {
    return appliedCoupon ? appliedCoupon.value / 25000 : 0;
  };

  const finalPriceVND = subtotal.vnd + shippingFeeVND - getDiscountVND();
  const finalPriceUSD = subtotal.usd + shippingFeeUSD - getDiscountUSD();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) return;
    
    if (!fullName || !phoneNumber || !email || !province || !district || !ward || !specificAddress) {
      alert(t("Vui lòng điền đầy đủ thông tin giao hàng.", "Please complete all delivery fields."));
      return;
    }

    if (!acceptPolicy) {
      alert(t("Bạn cần đồng ý với Chính sách bảo mật thông tin để tiếp tục.", "You must agree to our Privacy Policy to proceed."));
      return;
    }

    setSubmitting(true);

    // If Guest Checkout, we trigger passive registration first
    if (!user) {
      try {
        await axios.post('/api/auth/register-passive', {
          fullName,
          email,
          phoneNumber
        });
      } catch (err) {
        console.error("Lỗi đăng ký phụ:", err);
      }
    }

    // Map cart items to DTO format
    const checkoutItems = cart.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      isGiftBox: item.isGiftBox,
      cardMessage: item.cardMessage,
      boxSize: item.boxSize,
      giftItems: item.giftItems ? item.giftItems.map(g => ({
        productId: g.productId,
        quantity: g.quantity
      })) : null
    }));

    const payload = {
      userId: user ? user.id : null,
      guestName: fullName,
      guestPhone: phoneNumber,
      guestEmail: email,
      shippingAddress: `${specificAddress}, ${ward}, ${district}, ${province}`,
      paymentMethod,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      items: checkoutItems
    };

    try {
      const response = await axios.post('/api/orders/checkout', payload);
      clearCart();
      const data = response.data;
      
      // Navigate to order success page with details
      navigate(`/order-success?code=${data.orderCode}&method=${data.paymentMethod}&amount=${data.totalVND}&qr=${encodeURIComponent(data.qrCodeUrl)}&url=${encodeURIComponent(data.paymentUrl)}`);
    } catch (err) {
      console.error("Lỗi đặt hàng:", err);
      alert(t("Đặt hàng thất bại. Vui lòng kiểm tra lại tồn kho trà hoặc thông tin kết nối.", "Order failed. Check inventory levels or connection."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 24px' }}>
      <h2 style={{ fontSize: '32px', marginBottom: '30px', color: 'var(--primary-dark)', textAlign: 'left' }}>
        {t("Thanh Toán Đơn Hàng", "Checkout")}
      </h2>

      <form onSubmit={handlePlaceOrder} className="grid-3" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* Left Column: Delivery and Payment Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', textAlign: 'left' }}>
          {/* Delivery Form */}
          <div style={{ background: '#fff', padding: '30px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--primary-dark)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={20} /> {t("1. Thông tin giao hàng", "1. Delivery Information")}
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="flex-column">
                <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>{t("Họ và tên:", "Full Name:")}</label>
                <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>
              <div className="flex-column">
                <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>{t("Số điện thoại:", "Phone Number:")}</label>
                <input type="tel" required value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
              </div>
            </div>

            <div className="flex-column" style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>{t("Email nhận hóa đơn:", "Email:")}</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="flex-column">
                <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>{t("Tỉnh / Thành phố:", "Province:")}</label>
                <input type="text" required value={province} onChange={e => setProvince(e.target.value)} placeholder="Ví dụ: Đà Nẵng" />
              </div>
              <div className="flex-column">
                <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>{t("Quận / Huyện:", "District:")}</label>
                <input type="text" required value={district} onChange={e => setDistrict(e.target.value)} />
              </div>
              <div className="flex-column">
                <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>{t("Phường / Xã:", "Ward:")}</label>
                <input type="text" required value={ward} onChange={e => setWard(e.target.value)} />
              </div>
            </div>

            <div className="flex-column" style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>{t("Địa chỉ cụ thể (Số nhà, tên đường):", "Specific Address:")}</label>
              <input type="text" required value={specificAddress} onChange={e => setSpecificAddress(e.target.value)} />
            </div>

            <div className="flex-column">
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>{t("Ghi chú đơn hàng (không bắt buộc):", "Order Notes (optional):")}</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} style={{ resize: 'none' }} />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div style={{ background: '#fff', padding: '30px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--primary-dark)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={20} /> {t("2. Phương thức thanh toán", "2. Payment Method")}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label className="flex-between" style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="radio" name="payment" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                  <div>
                    <strong>{t("Thanh toán khi nhận hàng (COD)", "Cash on Delivery (COD)")}</strong>
                    <span style={{ fontSize: '12px', display: 'block', color: 'var(--text-muted)' }}>{t("Nhận trà và thanh toán tiền mặt trực tiếp cho shipper.", "Pay in cash upon tea delivery.")}</span>
                  </div>
                </div>
              </label>

              <label className="flex-between" style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="radio" name="payment" checked={paymentMethod === 'VietQR'} onChange={() => setPaymentMethod('VietQR')} />
                  <div>
                    <strong>{t("Chuyển khoản QR code nhanh (VietQR)", "Instant Bank Transfer (VietQR)")}</strong>
                    <span style={{ fontSize: '12px', display: 'block', color: 'var(--text-muted)' }}>{t("Tự động điền số tiền & thông tin đơn bằng mã VietQR tiện lợi.", "Auto-fills amounts & info with VietQR code.")}</span>
                  </div>
                </div>
              </label>

              <label className="flex-between" style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="radio" name="payment" checked={paymentMethod === 'MoMo'} onChange={() => setPaymentMethod('MoMo')} />
                  <div>
                    <strong>{t("Cổng ví điện tử MoMo", "MoMo E-wallet")}</strong>
                    <span style={{ fontSize: '12px', display: 'block', color: 'var(--text-muted)' }}>{t("Thanh toán nhanh qua ứng dụng MoMo trên điện thoại.", "Pay securely via MoMo wallet app.")}</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing Summary & Submit */}
        <div>
          <div className="checkout-summary">
            <h3 style={{ fontSize: '20px', color: 'var(--primary-dark)', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              {t("Thông tin thanh toán", "Payment Summary")}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '15px' }}>
              <div className="flex-between" style={{ fontSize: '15px' }}>
                <span>{t("Tạm tính trà:", "Subtotal:")}</span>
                <span>{formatPrice(subtotal.vnd, subtotal.usd)}</span>
              </div>
              <div className="flex-between" style={{ fontSize: '15px' }}>
                <span>{t("Phí vận chuyển:", "Shipping:")}</span>
                <span>{formatPrice(shippingFeeVND, shippingFeeUSD)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex-between" style={{ fontSize: '15px', color: 'green' }}>
                  <span>{t("Mã giảm giá:", "Discount:")}</span>
                  <span>-{formatPrice(getDiscountVND(), getDiscountUSD())}</span>
                </div>
              )}
            </div>

            {/* Coupon input */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input 
                type="text" 
                placeholder={t("Nhập mã SONTRAFREE", "Promo Code")} 
                value={couponCode} 
                onChange={e => setCouponCode(e.target.value)} 
                style={{ flexGrow: 1, padding: '8px 12px', borderRadius: '6px' }}
              />
              <button 
                type="button" 
                onClick={handleApplyCoupon}
                className="btn btn-outline" 
                style={{ padding: '8px 16px', borderRadius: '6px' }}
              >
                {t("Áp dụng", "Apply")}
              </button>
            </div>

            {/* Total */}
            <div className="flex-between" style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '18px', fontWeight: '600' }}>{t("Tổng cộng:", "Total:")}</span>
              <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--secondary)' }}>
                {formatPrice(finalPriceVND, finalPriceUSD)}
              </span>
            </div>

            {/* Privacy Checkbox */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '24px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <input 
                type="checkbox" 
                id="policy" 
                checked={acceptPolicy} 
                onChange={e => setAcceptPolicy(e.target.checked)} 
                style={{ marginTop: '2px' }}
              />
              <label htmlFor="policy">
                {t(
                  "Tôi đồng ý với Điều khoản mua hàng và Chính sách bảo mật thông tin khách hàng (tuân thủ Nghị định 13/2023/NĐ-CP).",
                  "I agree to the Terms of Purchase and Privacy Policy (complying with Decree 13/2023/ND-CP)."
                )}
              </label>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px 0', fontSize: '16px' }}
              disabled={submitting}
            >
              {submitting ? t("Đang xử lý đơn...", "Placing Order...") : t("Xác nhận & Đặt hàng", "Place Order")}
            </button>

            {/* Medical disclaimer note */}
            <div style={{ marginTop: '20px', background: 'hsl(35, 40%, 92%)', padding: '10px', borderRadius: '6px', display: 'flex', gap: '8px', fontSize: '11px', color: 'var(--primary-dark)' }}>
              <ShieldAlert size={20} style={{ flexShrink: 0 }} />
              <p>{t("Sản phẩm hỗ trợ cải thiện giấc ngủ & giải độc cơ thể, không phải là thuốc điều trị bệnh lý.", "Herbs assist sleep and detox, not intended to diagnose or treat diseases.")}</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
