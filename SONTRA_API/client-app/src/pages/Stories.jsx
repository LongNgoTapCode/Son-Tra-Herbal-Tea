import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useApp } from '../AppContext';
import { MapPin, Info } from 'lucide-react';

export default function Stories() {
  const { t } = useApp();
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/ingredients')
      .then(res => {
        setIngredients(res.data);
        if (res.data.length > 0) {
          setSelectedIngredient(res.data[0]); // default select first
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi lấy nguyên liệu:', err);
        setLoading(false);
      });
  }, []);

  // Helper to map Lat/Long coordinates to a stylized Vietnam map (X/Y percentages)
  // Vietnam Lat range roughly: 8.5 to 23.4
  // Vietnam Long range roughly: 102.1 to 109.5
  const getCoordinates = (lat, lng) => {
    const minLat = 8.5;
    const maxLat = 23.4;
    const minLng = 102.1;
    const maxLng = 109.5;

    // Convert to percentages
    let y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
    let x = ((lng - minLng) / (maxLng - minLng)) * 100;

    // Apply adjustments to match stylized map shape
    // Vietnam bends like an S.
    // For visual mapping on our abstract CSS map, we can map them directly:
    return { 
      top: `${Math.max(5, Math.min(95, y))}%`, 
      left: `${Math.max(5, Math.min(95, x))}%` 
    };
  };

  return (
    <div className="container" style={{ padding: '60px 24px' }}>
      <h2 style={{ fontSize: '36px', marginBottom: '16px', color: 'var(--primary-dark)', textAlign: 'center' }}>
        {t("Câu chuyện Nguyên liệu & Bản đồ xuất xứ", "Ingredient Story & Origin Map")}
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px', textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px' }}>
        {t(
          "Chúng tôi cam kết sử dụng 100% thảo mộc tự nhiên Việt Nam được thu hái từ các vùng nguyên liệu sạch, minh bạch hóa vị trí địa lý từng thành phần để tạo niềm tin trọn vẹn.",
          "We commit to using 100% natural Vietnamese herbs harvested from clean regions, transparently mapping each ingredient to build complete trust."
        )}
      </p>

      {loading ? (
        <div className="flex-center" style={{ minHeight: '300px' }}>
          <p>{t("Đang tải bản đồ nguyên liệu...", "Loading origin map...")}</p>
        </div>
      ) : (
        <div className="grid-2">
          {/* Vietnam Interactive Map Column */}
          <div>
            <h3 style={{ fontSize: '22px', marginBottom: '20px', color: 'var(--primary)' }}>
              {t("Bản đồ Vùng nguyên liệu Việt Nam", "Vietnam Sourcing Map")}
            </h3>
            <div className="map-container">
              {/* Draw an abstract Vietnam S-curve inside the map container */}
              <svg 
                viewBox="0 0 100 100" 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.2 }}
              >
                <path 
                  d="M 50 10 Q 55 25 45 40 T 70 70 T 75 90" 
                  fill="none" 
                  stroke="var(--primary)" 
                  strokeWidth="8" 
                  strokeLinecap="round"
                />
              </svg>

              {ingredients.map(ing => {
                const coords = getCoordinates(ing.latitude, ing.longitude);
                const isSelected = selectedIngredient?.id === ing.id;
                return (
                  <div 
                    key={ing.id} 
                    className="map-marker"
                    style={{ 
                      top: coords.top, 
                      left: coords.left,
                    }}
                    onClick={() => setSelectedIngredient(ing)}
                  >
                    <MapPin 
                      size={isSelected ? 32 : 24} 
                      color={isSelected ? 'var(--secondary)' : 'var(--primary)'} 
                      fill={isSelected ? 'var(--secondary)' : 'hsla(136, 16%, 30%, 0.3)'}
                      style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' }}
                    />
                  </div>
                );
              })}

              {/* Dynamic Popup inside the map */}
              {selectedIngredient && (
                <div className="map-popup">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Info size={16} color="var(--secondary)" />
                    <strong style={{ fontSize: '16px', color: 'var(--primary-dark)' }}>
                      {t(selectedIngredient.name, selectedIngredient.nameEN)}
                    </strong>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    <strong>{t("Xuất xứ:", "Origin:")}</strong> {selectedIngredient.originProvince}
                  </p>
                  <p style={{ fontSize: '13px', lineHeight: '1.4' }}>
                    {t(selectedIngredient.description, selectedIngredient.descriptionEN)}
                  </p>
                </div>
              )}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '10px' }}>
              {t("* Nhấp vào các ghim (Marker) trên bản đồ để xem chi tiết thông tin và vùng nguyên liệu của thảo mộc.", "* Click on the pins on the map to see details and harvesting origins of each herb.")}
            </p>
          </div>

          {/* Ingredient Details / Cards Column */}
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '22px', marginBottom: '20px', color: 'var(--primary)' }}>
              {t("Thông tin Thảo mộc tuyển chọn", "Selected Herbal Details")}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
              {ingredients.map(ing => (
                <div 
                  key={ing.id}
                  style={{
                    background: '#fff',
                    borderRadius: 'var(--radius)',
                    padding: '20px',
                    border: selectedIngredient?.id === ing.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow)',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                  onClick={() => setSelectedIngredient(ing)}
                >
                  <div className="flex-between" style={{ marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '18px', color: 'var(--primary-dark)', margin: 0 }}>
                      {t(ing.name, ing.nameEN)}
                    </h4>
                    <span 
                      style={{ 
                        background: 'var(--accent)', 
                        color: 'var(--primary-dark)', 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {ing.originProvince}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    {t(ing.description, ing.descriptionEN)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
