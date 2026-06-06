import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../AppContext';
import { Gift, Plus, Minus, CheckCircle, Info } from 'lucide-react';

export default function GiftBoxPage() {
  const { t, formatPrice, addToCart } = useApp();
  
  const [products, setProducts] = useState([]);
  const [boxShell, setBoxShell] = useState(null);
  
  // Selection states
  const [boxSize, setBoxSize] = useState('Small'); // Small (max 2), Large (max 4)
  const [selectedTeas, setSelectedTeas] = useState({}); // { productId: qty }
  const [cardMessage, setCardMessage] = useState('');
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/products')
      .then(res => {
        const shell = res.data.find(p => p.isGiftBoxShell);
        const teas = res.data.filter(p => !p.isGiftBoxShell && p.isActive);
        setBoxShell(shell);
        setProducts(teas);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi lấy danh mục hộp quà:', err);
        setLoading(false);
      });
  }, []);

  const maxSlots = boxSize === 'Small' ? 2 : 4;
  const currentTotalTeas = Object.values(selectedTeas).reduce((sum, val) => sum + val, 0);

  const handleAddTea = (productId) => {
    if (currentTotalTeas >= maxSlots) {
      alert(t(`Hộp quà cỡ ${boxSize === 'Small' ? 'Nhỏ' : 'Lớn'} chỉ chứa tối đa ${maxSlots} gói trà.`, `The ${boxSize} box can only hold up to ${maxSlots} packages.`));
      return;
    }
    setSelectedTeas(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const handleRemoveTea = (productId) => {
    setSelectedTeas(prev => {
      const copy = { ...prev };
      if (copy[productId] > 1) {
        copy[productId] -= 1;
      } else {
        delete copy[productId];
      }
      return copy;
    });
  };

  // Price calculations
  const shellPriceVND = boxShell ? boxShell.priceVND : 30000;
  const shellPriceUSD = boxShell ? boxShell.priceUSD : 1.20;
  
  // Large box has a slight premium (+10,000 VND / $0.40 USD)
  const sizePremiumVND = boxSize === 'Large' ? 10000 : 0;
  const sizePremiumUSD = boxSize === 'Large' ? 0.40 : 0;

  const getContentsPrice = () => {
    let priceVND = 0;
    let priceUSD = 0;
    Object.entries(selectedTeas).forEach(([id, qty]) => {
      const prod = products.find(p => p.id === parseInt(id));
      if (prod) {
        priceVND += prod.priceVND * qty;
        priceUSD += prod.priceUSD * qty;
      }
    });
    return { priceVND, priceUSD };
  };

  const contentsPrice = getContentsPrice();
  const finalPriceVND = shellPriceVND + sizePremiumVND + contentsPrice.priceVND;
  const finalPriceUSD = shellPriceUSD + sizePremiumUSD + contentsPrice.priceUSD;

  const handleAddBoxToCart = () => {
    if (currentTotalTeas === 0) {
      alert(t("Vui lòng thêm ít nhất 1 loại trà vào hộp quà.", "Please select at least 1 tea flavor for the box."));
      return;
    }

    // Map selectedTeas state to list format: [{ productId, quantity }]
    const giftItems = Object.entries(selectedTeas).map(([id, qty]) => ({
      productId: parseInt(id),
      quantity: qty
    }));

    // Create a virtual product representing this custom box shell
    const customProduct = {
      ...boxShell,
      priceVND: shellPriceVND + sizePremiumVND,
      priceUSD: shellPriceUSD + sizePremiumUSD
    };

    addToCart(customProduct, 1, true, cardMessage, boxSize, giftItems);
    alert(t("Đã thêm Hộp quà tự chọn của bạn vào Giỏ hàng!", "Added your custom Gift Box to the Cart!"));
    
    // Reset inputs
    setSelectedTeas({});
    setCardMessage('');
  };

  return (
    <div className="container" style={{ padding: '60px 24px' }}>
      <h2 style={{ fontSize: '36px', marginBottom: '16px', color: 'var(--primary-dark)', textAlign: 'center' }}>
        {t("Tự Thiết Kế Hộp Quà Tặng", "Custom Gift Box Designer")}
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px', textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px' }}>
        {t(
          "Hãy tự chọn các vị trà yêu thích của bạn bỏ vào chiếc hộp giấy kraft trắng phong cách tối giản của chúng tôi và gửi kèm một bức thiệp viết tay chân thành.",
          "Select your favorite tea blends to put inside our white minimalist kraft gift box, along with a handwritten card."
        )}
      </p>

      {loading ? (
        <div className="flex-center" style={{ minHeight: '300px' }}>
          <p>{t("Đang tải dữ liệu thiết kế...", "Loading designer tool...")}</p>
        </div>
      ) : (
        <div className="grid-2">
          {/* Design Visualization Canvas Column */}
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '22px', marginBottom: '20px', color: 'var(--primary)' }}>
              {t("1. Xem trước hộp quà của bạn", "1. Preview Your Box")}
            </h3>
            
            <div className="giftbox-canvas flex-column flex-center gap-20">
              <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <Info size={16} />
                <span>{t(`Đã chọn: ${currentTotalTeas}/${maxSlots} gói`, `Capacity: ${currentTotalTeas}/${maxSlots} slots`)}</span>
              </div>

              {/* Box Wireframe Representation */}
              <div className="box-visualization">
                {Object.entries(selectedTeas).flatMap(([id, qty]) => {
                  const prod = products.find(p => p.id === parseInt(id));
                  return Array(qty).fill(0).map((_, idx) => (
                    <div key={`${id}-${idx}`} className="giftbox-item-slot">
                      {prod ? t(prod.name.split(' ')[1] || "Trà", prod.nameEN.split(' ')[0]) : "Tea"}
                    </div>
                  ));
                })}
                {currentTotalTeas === 0 && (
                  <span style={{ color: 'var(--text-muted)', fontSize: '14px', width: '100%', textAlign: 'center' }}>
                    {t("(Hộp quà còn trống)", "(Box is currently empty)")}
                  </span>
                )}
              </div>

              {/* Message preview */}
              {cardMessage && (
                <div style={{ border: '1px solid var(--accent-dark)', background: 'var(--accent-light)', padding: '12px 20px', borderRadius: '8px', width: '100%', maxWidth: '300px', fontSize: '13px', fontStyle: 'italic', position: 'relative' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', fontStyle: 'normal', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    {t("Thiệp kèm theo:", "Greeting Card:")}
                  </span>
                  "{cardMessage}"
                </div>
              )}
            </div>
          </div>

          {/* Builder Panel Column */}
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '22px', marginBottom: '20px', color: 'var(--primary)' }}>
              {t("2. Lựa chọn cấu hình hộp quà", "2. Configure Custom Box")}
            </h3>

            {/* Box Size Switch */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                {t("Chọn kích thước vỏ hộp:", "Choose Box Size:")}
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className={`btn ${boxSize === 'Small' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ borderRadius: '8px', padding: '8px 16px' }}
                  onClick={() => {
                    setBoxSize('Small');
                    setSelectedTeas({});
                  }}
                >
                  {t("Hộp Nhỏ (2 vị - 30.000đ)", "Small (2 flavors - 30k)")}
                </button>
                <button 
                  className={`btn ${boxSize === 'Large' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ borderRadius: '8px', padding: '8px 16px' }}
                  onClick={() => {
                    setBoxSize('Large');
                    setSelectedTeas({});
                  }}
                >
                  {t("Hộp Lớn (4 vị - 40.000đ)", "Large (4 flavors - 40k)")}
                </button>
              </div>
            </div>

            {/* Tea Selector List */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '10px' }}>
                {t("Bỏ trà vào hộp:", "Select Tea Packs to Insert:")}
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {products.map(p => {
                  const qty = selectedTeas[p.id] || 0;
                  return (
                    <div key={p.id} className="flex-between" style={{ padding: '12px 16px', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#fff' }}>
                      <div>
                        <strong style={{ fontSize: '15px' }}>{t(p.name, p.nameEN)}</strong>
                        <span style={{ fontSize: '12px', display: 'block', color: 'var(--text-muted)' }}>
                          {formatPrice(p.priceVND, p.priceUSD)} / {t("gói", "pack")}
                        </span>
                      </div>
                      <div className="flex-center gap-10">
                        {qty > 0 && (
                          <button 
                            onClick={() => handleRemoveTea(p.id)} 
                            style={{ background: 'var(--secondary)', color: '#fff', borderRadius: '50%', width: '28px', height: '28px' }}
                            className="flex-center"
                          >
                            <Minus size={14} />
                          </button>
                        )}
                        {qty > 0 && <span style={{ fontWeight: '600', fontSize: '16px', minWidth: '15px', textAlign: 'center' }}>{qty}</span>}
                        <button 
                          onClick={() => handleAddTea(p.id)} 
                          style={{ background: 'var(--primary)', color: '#fff', borderRadius: '50%', width: '28px', height: '28px' }}
                          className="flex-center"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Greeting Card Message */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                {t("Lời chúc viết tay kèm theo thiệp:", "Write greeting message on card:")}
              </label>
              <textarea 
                value={cardMessage}
                onChange={(e) => setCardMessage(e.target.value)}
                placeholder={t("Nhập lời chúc chân thành gửi đến người nhận...", "Enter your sweet message...")}
                rows={3}
                style={{ width: '100%', resize: 'none' }}
              />
            </div>

            {/* Pricing Summary & Add to Cart */}
            <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: '20px' }}>
              <div className="flex-between" style={{ marginBottom: '15px' }}>
                <span style={{ fontSize: '18px', fontWeight: '500' }}>{t("Tổng giá trị hộp quà:", "Total Custom Gift Box:")}</span>
                <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--secondary)' }}>
                  {formatPrice(finalPriceVND, finalPriceUSD)}
                </span>
              </div>
              <button 
                onClick={handleAddBoxToCart}
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px 0', fontSize: '16px' }}
              >
                <Gift size={18} /> {t("Thêm hộp quà này vào Giỏ hàng", "Add this Box to Cart")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
