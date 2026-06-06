import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useApp } from '../AppContext';
import { Leaf, Award, Compass, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const { formatPrice, addToCart, t } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi lấy sản phẩm:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container grid-2">
          <div>
            <span className="hero-tag">Son Tra Herbal Tea</span>
            <h1 className="hero-title">
              {t("Trà thảo mộc tự nhiên từ bán đảo Sơn Trà", "Natural Herbal Tea from Son Tra Peninsula")}
            </h1>
            <p className="hero-subtitle">
              {t(
                "Được tuyển chọn thủ công từ những loại thảo mộc lành tính giúp cải thiện giấc ngủ, làm dịu lo âu và thanh lọc cơ thể cho người làm việc văn phòng.",
                "Handcrafted from gentle herbs to improve sleep, calm anxiety, and detoxify the body for office workers."
              )}
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Link to="/quiz" className="btn btn-primary">
                <Compass size={18} /> {t("Tư vấn chọn trà", "Herb Advisor Quiz")}
              </Link>
              <Link to="/giftbox" className="btn btn-outline">
                {t("Tự chọn hộp quà", "Custom Gift Box")}
              </Link>
            </div>
          </div>
          <div className="flex-center">
            <img 
              src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop" 
              alt="Son Tra Herbal Tea Hero" 
              style={{ width: '100%', borderRadius: '24px', boxShadow: 'var(--shadow)', objectFit: 'cover', height: '400px' }}
            />
          </div>
        </div>
      </section>

      {/* Selling Points */}
      <section style={{ padding: '60px 0', background: '#fff' }}>
        <div className="container grid-3">
          <div className="flex-column gap-10" style={{ textAlign: 'left', padding: '20px' }}>
            <Leaf size={32} color="var(--primary)" />
            <h3 style={{ fontSize: '20px' }}>{t("Thảo mộc tự nhiên", "100% Natural Herbs")}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {t("Nguyên liệu thô nhìn thấy trực tiếp qua bao bì kính trong suốt, cam kết không chất bảo quản.", "Raw ingredients visible through transparent packaging window. Zero preservatives.")}
            </p>
          </div>
          <div className="flex-column gap-10" style={{ textAlign: 'left', padding: '20px' }}>
            <Award size={32} color="var(--primary)" />
            <h3 style={{ fontSize: '20px' }}>{t("Minh bạch nguồn gốc", "Traceable Origin")}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {t("Rõ ràng vùng thu hái thảo mộc nội địa từ Bắc vào Nam trên Bản đồ nguyên liệu trực quan.", "Clearly traced local harvesting regions from North to South on our interactive origin map.")}
            </p>
          </div>
          <div className="flex-column gap-10" style={{ textAlign: 'left', padding: '20px' }}>
            <MessageSquare size={32} color="var(--primary)" />
            <h3 style={{ fontSize: '20px' }}>{t("Cá nhân hóa trải nghiệm", "Personalized Experience")}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {t("Tự thiết kế hộp quà, ghi thiệp chúc mừng hoặc làm trắc nghiệm sức khỏe để tìm dòng trà phù hợp.", "Design your own gift boxes, write greeting cards, or take our wellness quiz to find the perfect tea.")}
            </p>
          </div>
        </div>
      </section>

      {/* Product Catalog */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '36px', marginBottom: '16px', color: 'var(--primary-dark)' }}>
            {t("Bộ sưu tập Trà thảo mộc", "Our Herbal Tea Collection")}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>
            {t("Vị ngọt thanh khiết, lành tính cho cơ thể khỏe mạnh mỗi ngày.", "Pure sweet taste, gentle properties for a healthy body every day.")}
          </p>

          {loading ? (
            <div className="flex-center" style={{ minHeight: '200px' }}>
              <p>{t("Đang tải danh sách trà...", "Loading tea list...")}</p>
            </div>
          ) : (
            <div className="grid-3">
              {products.map(p => (
                <div key={p.id} className="product-card">
                  <div className="product-img-container">
                    <img src={p.imageURL} alt={p.name} className="product-img" />
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">{t(p.name, p.nameEN)}</h3>
                    <p className="product-desc">{t(p.description, p.descriptionEN)}</p>
                    <div className="flex-between" style={{ marginTop: 'auto' }}>
                      <span className="product-price">{formatPrice(p.priceVND, p.priceUSD)}</span>
                      {p.isGiftBoxShell ? (
                        <Link to="/giftbox" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '14px' }}>
                          {t("Thiết kế ngay", "Design Box")}
                        </Link>
                      ) : (
                        <button 
                          onClick={() => addToCart(p, 1)} 
                          className="btn btn-primary" 
                          style={{ padding: '8px 16px', fontSize: '14px' }}
                        >
                          {t("Thêm vào giỏ", "Add to Cart")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
