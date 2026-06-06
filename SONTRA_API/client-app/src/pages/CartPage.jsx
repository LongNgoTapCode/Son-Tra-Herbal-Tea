import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, formatPrice, t } = useApp();

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

  if (cart.length === 0) {
    return (
      <div className="container flex-column flex-center" style={{ padding: '80px 24px', minHeight: '400px', gap: '20px' }}>
        <ShoppingBag size={64} color="var(--text-muted)" />
        <h2 style={{ color: 'var(--primary-dark)' }}>{t("Giỏ hàng của bạn đang rỗng", "Your Cart is Empty")}</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          {t("Hãy quay lại lựa chọn những gói trà thảo mộc tươi mát và tốt cho sức khỏe nhé.", "Go back and select some fresh, healthy herbal teas.")}
        </p>
        <Link to="/" className="btn btn-primary">{t("Quay lại Mua sắm", "Back to Shop")}</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '60px 24px' }}>
      <h2 style={{ fontSize: '32px', marginBottom: '30px', color: 'var(--primary-dark)', textAlign: 'left' }}>
        {t("Giỏ Hàng Của Bạn", "Your Shopping Cart")}
      </h2>

      <div className="grid-3" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {cart.map((item, idx) => (
            <div 
              key={`${item.productId}-${idx}`} 
              style={{
                background: '#fff',
                borderRadius: 'var(--radius)',
                padding: '20px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow)',
                display: 'grid',
                gridTemplateColumns: '80px 1fr 120px 40px',
                gap: '20px',
                alignItems: 'center',
                textAlign: 'left'
              }}
            >
              {/* Product Thumbnail */}
              <img 
                src={item.imageURL} 
                alt={item.name} 
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
              />

              {/* Product Info */}
              <div>
                <strong style={{ fontSize: '18px', color: 'var(--primary-dark)', display: 'block' }}>
                  {t(item.name, item.nameEN)}
                </strong>
                
                {/* Specific details if it's a Custom Gift Box */}
                {item.isGiftBox && (
                  <div style={{ marginTop: '8px', padding: '10px 15px', background: 'var(--bg-cream)', borderRadius: '6px', fontSize: '13px' }}>
                    <span style={{ fontWeight: '600', display: 'block', color: 'var(--secondary)' }}>
                      {t(`Hộp quà cỡ: ${item.boxSize === 'Small' ? 'Nhỏ (2 gói)' : 'Lớn (4 gói)'}`, `Box size: ${item.boxSize}`)}
                    </span>
                    {item.giftItems && (
                      <ul style={{ paddingLeft: '16px', margin: '4px 0', color: 'var(--text-muted)' }}>
                        {item.giftItems.map((gift, gIdx) => (
                          <li key={gIdx}>
                            {gift.quantity}x {t(
                              // Since product names might not be in sub-item, we find them
                              gift.productId === 1 ? "Trà Êm" : gift.productId === 2 ? "Trà Thanh" : gift.productId === 3 ? "Trà Yên" : "Trà Dịu",
                              gift.productId === 1 ? "Em Tea" : gift.productId === 2 ? "Thanh Tea" : gift.productId === 3 ? "Yen Tea" : "Diu Tea"
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.cardMessage && (
                      <span style={{ display: 'block', fontStyle: 'italic', marginTop: '4px' }}>
                        "{item.cardMessage}"
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Quantity Controls */}
              <div className="flex-center" style={{ gap: '10px', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '6px 12px' }}>
                <button onClick={() => updateQuantity(idx, item.quantity - 1)} style={{ fontSize: '18px', fontWeight: 'bold' }}>-</button>
                <span style={{ fontWeight: '600', fontSize: '16px', minWidth: '15px', textAlign: 'center' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(idx, item.quantity + 1)} style={{ fontSize: '16px', fontWeight: 'bold' }}>+</button>
              </div>

              {/* Delete Button */}
              <button 
                onClick={() => removeFromCart(idx)} 
                style={{ color: 'var(--secondary)' }}
                className="flex-center"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Pricing Summary */}
        <div>
          <div className="checkout-summary">
            <h3 style={{ fontSize: '20px', color: 'var(--primary-dark)', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              {t("Tóm tắt đơn hàng", "Order Summary")}
            </h3>
            
            <div className="flex-between" style={{ marginBottom: '15px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t("Tạm tính:", "Subtotal:")}</span>
              <span style={{ fontWeight: '600', fontSize: '18px' }}>
                {formatPrice(subtotal.vnd, subtotal.usd)}
              </span>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              {t("* Phí vận chuyển và mã giảm giá sẽ được áp dụng ở trang thanh toán kế tiếp.", "* Shipping fee and promo codes will be calculated at checkout.")}
            </p>

            <Link 
              to="/checkout" 
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px 0', fontSize: '16px' }}
            >
              {t("Tiến hành Thanh toán", "Proceed to Checkout")} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
