import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useApp } from './AppContext';
import Home from './pages/Home';
import Stories from './pages/Stories';
import Quiz from './pages/Quiz';
import GiftBoxPage from './pages/GiftBoxPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import { Leaf, ShoppingCart, User, Globe, DollarSign } from 'lucide-react';

function App() {
  const { cart, lang, setLang, currency, setCurrency, user, t } = useApp();
  const location = useLocation();

  // Check if we are inside the admin page to hide main header/footer
  const isAdminPage = location.pathname.startsWith('/admin');

  // Total cart items quantity
  const totalCartQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Navigation Header - Hidden on Admin Dashboard for clean workstation view */}
      {!isAdminPage && (
        <header className="header">
          <div className="container flex-between">
            <Link to="/" className="logo-container">
              <Leaf size={28} color="var(--primary)" />
              <span className="logo-text">Son Tra <span style={{ fontFamily: 'var(--font-sans)', fontWeight: '400', fontSize: '20px' }}>Herbal Tea</span></span>
            </Link>

            <nav className="nav-links">
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                {t("Trang chủ", "Home")}
              </Link>
              <Link to="/stories" className={`nav-link ${location.pathname === '/stories' ? 'active' : ''}`}>
                {t("Nguồn nguyên liệu", "Stories")}
              </Link>
              <Link to="/quiz" className={`nav-link ${location.pathname === '/quiz' ? 'active' : ''}`}>
                {t("Advisor Quiz", "Quiz")}
              </Link>
              <Link to="/giftbox" className={`nav-link ${location.pathname === '/giftbox' ? 'active' : ''}`}>
                {t("Hộp quà tự thiết kế", "Gift Box")}
              </Link>
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Language Switch */}
              <button 
                onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')} 
                className="flex-center" 
                style={{ gap: '4px', fontSize: '14px', fontWeight: '500' }}
                title={t("Đổi ngôn ngữ", "Change language")}
              >
                <Globe size={16} />
                <span>{lang.toUpperCase()}</span>
              </button>

              {/* Currency Switch */}
              <button 
                onClick={() => setCurrency(currency === 'VND' ? 'USD' : 'VND')} 
                className="flex-center" 
                style={{ gap: '4px', fontSize: '14px', fontWeight: '500' }}
                title={t("Đổi tiền tệ", "Change currency")}
              >
                <DollarSign size={16} />
                <span>{currency}</span>
              </button>

              {/* Shopping Cart Icon */}
              <Link to="/cart" style={{ position: 'relative' }} className="flex-center">
                <ShoppingCart size={22} color="var(--primary)" />
                {totalCartQty > 0 && <span className="cart-badge">{totalCartQty}</span>}
              </Link>

              {/* Login / Admin Link */}
              {user ? (
                <Link to="/admin" className="flex-center" style={{ gap: '6px', fontSize: '14px', fontWeight: '500', color: 'var(--primary)' }}>
                  <User size={18} />
                  <span>Admin</span>
                </Link>
              ) : (
                <Link to="/login" className="flex-center" style={{ gap: '6px', fontSize: '14px', color: 'var(--text-muted)' }}>
                  <User size={18} />
                </Link>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main Content Viewport */}
      <main style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/giftbox" element={<GiftBoxPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>

      {/* Footer - Hidden on Admin Dashboard */}
      {!isAdminPage && (
        <footer className="footer">
          <div className="container">
            <div className="grid-3" style={{ gridTemplateColumns: '1.2fr 1fr 1fr' }}>
              <div>
                <div className="logo-container" style={{ marginBottom: '16px' }}>
                  <Leaf size={24} color="var(--accent)" />
                  <span className="logo-text" style={{ color: '#fff' }}>Son Tra <span style={{ fontFamily: 'var(--font-sans)', fontWeight: '400', fontSize: '18px' }}>Herbal Tea</span></span>
                </div>
                <p style={{ fontSize: '14px', opacity: 0.7, color: '#fff' }}>
                  {t(
                    "Đồng hành khởi nghiệp cùng dự án môn học khởi nghiệp đại học.",
                    "An academic startup project supporting college entrepreneurship course evaluation."
                  )}
                </p>
              </div>
              
              <div style={{ paddingLeft: '20px' }}>
                <h4 style={{ fontSize: '16px', color: 'var(--accent)', marginBottom: '16px', fontWeight: '600' }}>
                  {t("Đường dẫn nhanh", "Quick Links")}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', opacity: 0.8 }}>
                  <Link to="/">{t("Trang chủ", "Home")}</Link>
                  <Link to="/stories">{t("Nguyên liệu", "Stories")}</Link>
                  <Link to="/quiz">{t("Bài Trắc Nghiệm", "Advisor Quiz")}</Link>
                  <Link to="/giftbox">{t("Tự Phối Hộp Quà", "Custom Gift Box")}</Link>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '16px', color: 'var(--accent)', marginBottom: '16px', fontWeight: '600' }}>
                  {t("Liên hệ", "Contact Info")}
                </h4>
                <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>
                  Email: team@sontraherbaltea.com
                </p>
                <p style={{ fontSize: '14px', opacity: 0.8 }}>
                  {t("Vị trí: Bán đảo Sơn Trà, Đà Nẵng, Việt Nam", "Location: Son Tra Peninsula, Da Nang, Vietnam")}
                </p>
              </div>
            </div>

            {/* Medical Disclaimer & Compliance Disclaimer */}
            <div className="footer-disclaimer">
              <p style={{ marginBottom: '10px' }}>
                <strong>{t("Khuyến cáo y tế:", "Medical Disclaimer:")}</strong> {t(
                  "Các sản phẩm trà của Son Tra Herbal Tea là thực phẩm tự nhiên hỗ trợ cải thiện sức khỏe, không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh. Vui lòng tham khảo ý kiến bác sĩ chuyên khoa nếu bạn đang mang thai hoặc có bệnh lý đặc biệt.",
                  "Son Tra Herbal Tea blends are natural foods to support wellness, not intended to diagnose, treat, or replace professional medical advice. Please consult your physician if you are pregnant or have specific medical conditions."
                )}
              </p>
              <p>
                {t(
                  "© 2026 Dự án Khởi Nghiệp Son Tra Herbal Tea. Tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.",
                  "© 2026 Son Tra Herbal Tea Entrepreneurship Project. Compliant with Decree 13/2023/ND-CP on personal data protection."
                )}
              </p>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}

export default App;
