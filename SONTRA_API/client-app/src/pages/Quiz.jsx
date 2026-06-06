import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../AppContext';
import { Heart, Activity, CheckCircle, RefreshCw, ShoppingCart } from 'lucide-react';

export default function Quiz() {
  const { t, formatPrice, addToCart } = useApp();
  const [step, setStep] = useState(1);
  const [symptom, setSymptom] = useState(null);
  const [preference, setPreference] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Lỗi lấy sản phẩm:', err));
  }, []);

  const symptomsList = [
    { 
      id: 'insomnia', 
      title: t("Khó ngủ / Mất ngủ", "Insomnia / Hard to sleep"), 
      desc: t("Hay trằn trọc ban đêm, ngủ không sâu giấc, sáng dậy mệt mỏi.", "Tossing and turning, shallow sleep, waking up tired.")
    },
    { 
      id: 'heat', 
      title: t("Nóng trong người / Nổi mụn", "Internal Heat / Acne"), 
      desc: t("Nhiệt miệng, mụn nhọt, cần giải độc mát gan thanh lọc cơ thể.", "Mouth ulcers, pimples, need liver detox and body cooling.")
    },
    { 
      id: 'stress', 
      title: t("Mệt mỏi / Căng thẳng (Stress)", "Fatigue / Stress"), 
      desc: t("Làm việc văn phòng nhiều, nhức đầu, lo âu, cần làm dịu tinh thần.", "Long office hours, headache, anxiety, need mind soothing.")
    },
    { 
      id: 'digestion', 
      title: t("Ăn uống khó tiêu / Trướng bụng", "Indigestion / Bloated"), 
      desc: t("Hệ tiêu hóa kém, hay đầy hơi, cần dòng trà dịu bụng thanh mát.", "Weak digestion, bloating, need a stomach-soothing cooling tea.")
    }
  ];

  const preferencesList = [
    { id: 'flower', text: t("Thơm dịu hương hoa tự nhiên", "Mild natural floral scent") },
    { id: 'melon', text: t("Ngọt thanh vị bí đao & táo đỏ", "Sweet winter melon & red dates") },
    { id: 'sen', text: t("Thanh nhẹ đắng nhẹ tâm sen an thần", "Light bitter calming lotus seed core") },
    { id: 'licorice', text: t("Vị Atiso kết hợp ngọt hậu cam thảo", "Hibiscus with sweet licorice aftertaste") }
  ];

  const calculateRecommendation = () => {
    let targetSlug = "";
    
    // Logic matching
    if (symptom === 'insomnia') {
      targetSlug = "tra-yen-ngu-ngon-sau-giac"; // Trà Yên
    } else if (symptom === 'heat') {
      targetSlug = "tra-thanh-mat-gan-giai-nhiet"; // Trà Thanh
    } else if (symptom === 'stress') {
      targetSlug = "tra-em-hoa-cuc-ky-tu"; // Trà Êm
    } else {
      targetSlug = "tra-diu-ngot-hau-thanh-loc"; // Trà Dịu
    }

    const matchedProduct = products.find(p => p.slug === targetSlug);
    setRecommendation(matchedProduct);
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setSymptom(null);
    setPreference(null);
    setRecommendation(null);
  };

  return (
    <div className="container" style={{ padding: '60px 24px' }}>
      <div className="quiz-container">
        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <Activity size={32} color="var(--primary)" />
              <h2 style={{ fontSize: '28px', marginTop: '10px', color: 'var(--primary-dark)' }}>
                {t("Cơ thể bạn đang cảm thấy thế nào?", "How is your body feeling today?")}
              </h2>
              <p style={{ color: 'var(--text-muted)' }}>
                {t("Chọn triệu chứng lớn nhất bạn đang gặp phải.", "Select the primary symptom you are experiencing.")}
              </p>
            </div>
            <div className="grid-2">
              {symptomsList.map(s => (
                <div 
                  key={s.id} 
                  className={`quiz-option ${symptom === s.id ? 'active' : ''}`}
                  onClick={() => {
                    setSymptom(s.id);
                    setStep(2);
                  }}
                >
                  <strong style={{ fontSize: '18px', color: 'var(--primary-dark)', display: 'block', marginBottom: '6px' }}>
                    {s.title}
                  </strong>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <Heart size={32} color="var(--primary)" />
              <h2 style={{ fontSize: '28px', marginTop: '10px', color: 'var(--primary-dark)' }}>
                {t("Gu vị giác yêu thích của bạn là gì?", "What is your taste preference?")}
              </h2>
              <p style={{ color: 'var(--text-muted)' }}>
                {t("Hương vị giúp bạn thưởng trà thư giãn hơn.", "A flavor profile that helps you enjoy and relax.")}
              </p>
            </div>
            <div className="flex-column gap-20">
              {preferencesList.map(p => (
                <div 
                  key={p.id} 
                  className={`quiz-option ${preference === p.id ? 'active' : ''}`}
                  style={{ textAlign: 'center', padding: '16px 20px' }}
                  onClick={() => setPreference(p.id)}
                >
                  <span style={{ fontSize: '16px', fontWeight: '500' }}>{p.text}</span>
                </div>
              ))}
            </div>
            <div className="flex-between" style={{ marginTop: '30px' }}>
              <button onClick={() => setStep(1)} className="btn btn-outline">
                {t("Quay lại", "Back")}
              </button>
              <button 
                onClick={calculateRecommendation} 
                className="btn btn-primary"
                disabled={!preference}
              >
                {t("Xem gợi ý của tôi", "See My Match")}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <CheckCircle size={48} color="var(--primary)" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontSize: '30px', color: 'var(--primary-dark)', marginBottom: '8px' }}>
              {t("Vị trà hoàn hảo dành cho bạn!", "Your Perfect Tea Match!")}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
              {t("Dựa vào trắc nghiệm sức khỏe, chúng tôi gợi ý cho bạn dòng trà này:", "Based on your quiz results, we highly recommend:")}
            </p>

            {recommendation ? (
              <div 
                style={{ 
                  background: '#fcfcfc', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius)', 
                  padding: '30px', 
                  maxWidth: '500px', 
                  margin: '0 auto 30px',
                  textAlign: 'left',
                  boxShadow: 'var(--shadow)'
                }}
              >
                <img 
                  src={recommendation.imageURL} 
                  alt={recommendation.name} 
                  style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }}
                />
                <h3 style={{ fontSize: '22px', color: 'var(--primary-dark)', marginBottom: '10px' }}>
                  {t(recommendation.name, recommendation.nameEN)}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  {t(recommendation.description, recommendation.descriptionEN)}
                </p>
                <div className="flex-between">
                  <span style={{ fontSize: '20px', fontWeight: '600', color: 'var(--secondary)' }}>
                    {formatPrice(recommendation.priceVND, recommendation.priceUSD)}
                  </span>
                  <button 
                    onClick={() => {
                      addToCart(recommendation, 1);
                      alert(t("Đã thêm trà vào giỏ hàng thành công!", "Added to cart successfully!"));
                    }} 
                    className="btn btn-primary"
                  >
                    <ShoppingCart size={16} /> {t("Thêm vào giỏ", "Add to Cart")}
                  </button>
                </div>
              </div>
            ) : (
              <p style={{ color: 'red' }}>{t("Lỗi kết nối. Không thể lấy thông tin trà lúc này.", "Connection error. Unable to load recommendation.")}</p>
            )}

            <button onClick={handleReset} className="btn btn-outline" style={{ gap: '8px' }}>
              <RefreshCw size={16} /> {t("Làm lại trắc nghiệm", "Retake Quiz")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
