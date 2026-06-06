import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const { t, setUser } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      setUser(response.data);
      // If successful, navigate to Admin panel
      navigate('/admin');
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setError(t("Sai tài khoản hoặc mật khẩu đăng nhập.", "Invalid email or password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex-center" style={{ padding: '80px 24px', minHeight: '500px' }}>
      <div 
        style={{ 
          background: '#fff', 
          border: '1px solid var(--border-color)', 
          borderRadius: 'var(--radius)', 
          padding: '40px', 
          width: '100%', 
          maxWidth: '400px',
          boxShadow: 'var(--shadow)',
          textAlign: 'left'
        }}
      >
        <h2 style={{ fontSize: '28px', color: 'var(--primary-dark)', marginBottom: '10px', textAlign: 'center' }}>
          {t("Đăng Nhập Quản Trị", "Admin Login")}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '30px', textAlign: 'center' }}>
          {t("Dành cho chủ cửa hàng và nhân viên vận hành.", "For store administrators and operators.")}
        </p>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '12px', borderRadius: '6px', fontSize: '13px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="flex-column">
            <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={16} /> Email:
            </label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="e.g. admin@sontra.com"
            />
          </div>

          <div className="flex-column">
            <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={16} /> {t("Mật khẩu:", "Password:")}
            </label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px 0', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? t("Đang kiểm tra...", "Logging in...") : t("Đăng nhập", "Login")}
          </button>
        </form>
      </div>
    </div>
  );
}
