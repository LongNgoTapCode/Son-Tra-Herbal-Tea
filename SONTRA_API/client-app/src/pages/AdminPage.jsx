import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart2, Package, ShoppingCart, ShieldAlert, LogOut, Check, X, RefreshCw } from 'lucide-react';

export default function AdminPage() {
  const { user, logout, t, formatPrice } = useApp();
  const navigate = useNavigate();

  // Active tab state
  const [activeTab, setActiveTab] = useState('');

  // Report states
  const [salesReport, setSalesReport] = useState(null);
  const [bestsellers, setBestsellers] = useState([]);
  
  // Inventory states
  const [inventory, setInventory] = useState([]);
  const [syncing, setSyncing] = useState(false);
  
  // Order states
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingCode, setTrackingCode] = useState('');
  
  // Review states
  const [pendingReviews, setPendingReviews] = useState([]);

  // Check auth
  useEffect(() => {
    if (!user || (user.role !== 'Admin' && user.role !== 'Warehouse' && user.role !== 'Staff' && user.role !== 'Content')) {
      navigate('/login');
      return;
    }

    // Set default tab based on role permissions
    if (user.role === 'Admin') setActiveTab('reports');
    else if (user.role === 'Warehouse') setActiveTab('inventory');
    else if (user.role === 'Staff') setActiveTab('orders');
    else if (user.role === 'Content') setActiveTab('reviews');
  }, [user, navigate]);

  // Set up axios headers
  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${user?.token}` }
  });

  // Load tab data
  useEffect(() => {
    if (!activeTab || !user) return;

    if (activeTab === 'reports' && user.role === 'Admin') {
      axios.get('/api/admin/reports/sales', getHeaders())
        .then(res => setSalesReport(res.data))
        .catch(err => console.error(err));

      axios.get('/api/admin/reports/bestsellers', getHeaders())
        .then(res => setBestsellers(res.data))
        .catch(err => console.error(err));
    }

    if (activeTab === 'inventory' && (user.role === 'Admin' || user.role === 'Warehouse')) {
      loadInventory();
    }

    if (activeTab === 'orders' && (user.role === 'Admin' || user.role === 'Staff')) {
      loadOrders();
    }

    if (activeTab === 'reviews' && (user.role === 'Admin' || user.role === 'Content')) {
      loadPendingReviews();
    }
  }, [activeTab, user]);

  const loadInventory = () => {
    axios.get('/api/admin/inventory', getHeaders())
      .then(res => setInventory(res.data))
      .catch(err => console.error(err));
  };

  const loadOrders = () => {
    axios.get('/api/admin/orders', getHeaders())
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  };

  const loadPendingReviews = () => {
    axios.get('/api/reviews/pending', getHeaders())
      .then(res => setPendingReviews(res.data))
      .catch(err => console.error(err));
  };

  // Stock edit
  const handleUpdateStock = (productId, newQty) => {
    axios.post(`/api/admin/inventory/${productId}/stock`, newQty, {
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}` 
      }
    })
      .then(() => {
        loadInventory();
        alert(t("Cập nhật kho thành công!", "Stock updated successfully!"));
      })
      .catch(err => alert("Cập nhật thất bại."));
  };

  const handleSyncPOS = () => {
    setSyncing(true);
    axios.post('/api/admin/inventory/sync', {}, getHeaders())
      .then(res => {
        loadInventory();
        alert(res.data.message);
      })
      .catch(err => alert("Lỗi đồng bộ."))
      .finally(() => setSyncing(false));
  };

  // Order status update
  const handleUpdateStatus = (orderId, status) => {
    axios.post(`/api/admin/orders/${orderId}/status`, {
      status,
      trackingCode
    }, getHeaders())
      .then(res => {
        loadOrders();
        setSelectedOrder(null);
        setTrackingCode('');
        alert(res.data.message);
      })
      .catch(err => alert("Cập nhật trạng thái thất bại."));
  };

  // Review actions
  const handleApproveReview = (reviewId) => {
    axios.post(`/api/reviews/${reviewId}/approve`, {}, getHeaders())
      .then(() => {
        loadPendingReviews();
        alert(t("Đã duyệt đánh giá!", "Approved review!"));
      })
      .catch(err => alert("Duyệt thất bại."));
  };

  const handleDeleteReview = (reviewId) => {
    axios.delete(`/api/reviews/${reviewId}`, getHeaders())
      .then(() => {
        loadPendingReviews();
        alert(t("Đã xóa đánh giá!", "Deleted review!"));
      })
      .catch(err => alert("Xóa thất bại."));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <div className="admin-sidebar">
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-serif)', color: 'var(--accent)' }}>
            Son Tra Admin
          </h3>
          <span style={{ fontSize: '12px', opacity: 0.7 }}>
            {t("Xin chào,", "Welcome,")} {user.fullName} ({user.role})
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
          {user.role === 'Admin' && (
            <button 
              className={`admin-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <BarChart2 size={18} /> {t("Báo cáo Doanh thu", "Sales Dashboard")}
            </button>
          )}

          {(user.role === 'Admin' || user.role === 'Staff') && (
            <button 
              className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingCart size={18} /> {t("Duyệt Đơn hàng", "Process Orders")}
            </button>
          )}

          {(user.role === 'Admin' || user.role === 'Warehouse') && (
            <button 
              className={`admin-nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              <Package size={18} /> {t("Quản lý Kho", "Inventory Stock")}
            </button>
          )}

          {(user.role === 'Admin' || user.role === 'Content') && (
            <button 
              className={`admin-nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              <ShieldAlert size={18} /> {t("Duyệt Đánh giá", "Review Moderation")}
            </button>
          )}
        </div>

        <button onClick={handleLogout} className="admin-nav-item" style={{ marginTop: 'auto', background: 'hsla(0,100%,50%,0.1)', color: '#ff6b6b' }}>
          <LogOut size={18} /> {t("Đăng xuất", "Log Out")}
        </button>
      </div>

      {/* Main Workspace Area */}
      <div className="admin-content">
        {/* TAB 1: REPORTS */}
        {activeTab === 'reports' && salesReport && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', fontSize: '28px', textAlign: 'left' }}>
              {t("Báo cáo kinh doanh", "Business Analytics")}
            </h2>

            {/* Sales Cards */}
            <div className="grid-3">
              <div className="admin-card">
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t("DOANH THU HÔM NAY", "REVENUE TODAY")}</span>
                <h3 style={{ fontSize: '28px', margin: '8px 0', color: 'var(--secondary)' }}>
                  {formatPrice(salesReport.today.revenueVND, salesReport.today.revenueUSD)}
                </h3>
                <span style={{ fontSize: '12px' }}>{salesReport.today.orderCount} {t("đơn hàng hoàn thành", "completed orders")}</span>
              </div>
              <div className="admin-card">
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t("DOANH THU THÁNG NÀY", "REVENUE THIS MONTH")}</span>
                <h3 style={{ fontSize: '28px', margin: '8px 0', color: 'var(--primary)' }}>
                  {formatPrice(salesReport.thisMonth.revenueVND, salesReport.thisMonth.revenueUSD)}
                </h3>
                <span style={{ fontSize: '12px' }}>{salesReport.thisMonth.orderCount} {t("đơn hàng hoàn thành", "completed orders")}</span>
              </div>
              <div className="admin-card">
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t("TỔNG DOANH THU TÍCH LŨY", "TOTAL CUMULATIVE SALES")}</span>
                <h3 style={{ fontSize: '28px', margin: '8px 0', color: 'var(--primary-dark)' }}>
                  {formatPrice(salesReport.total.revenueVND, salesReport.total.revenueUSD)}
                </h3>
                <span style={{ fontSize: '12px' }}>{salesReport.total.orderCount} {t("đơn hàng", "orders")}</span>
              </div>
            </div>

            {/* Custom CSS Bar Chart for Last 7 Days */}
            <div className="admin-card">
              <h4 style={{ fontSize: '18px', marginBottom: '20px', color: 'var(--primary-dark)' }}>
                {t("Biểu đồ doanh thu 7 ngày qua", "Daily Sales Chart (Last 7 Days)")}
              </h4>
              <div style={{ display: 'flex', height: '240px', alignItems: 'flex-end', justifyContent: 'space-around', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px' }}>
                {salesReport.chartData.map((d, index) => {
                  // Find max revenue to scale heights
                  const maxRevenue = Math.max(...salesReport.chartData.map(cd => cd.revenueVND), 100000);
                  const barHeight = `${(d.revenueVND / maxRevenue) * 80 + 10}%`; // at least 10% height
                  return (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, maxWidth: '60px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '500', marginBottom: '4px' }}>
                        {formatPrice(d.revenueVND, d.revenueUSD).split(' ')[0]}
                      </span>
                      <div 
                        style={{ 
                          width: '24px', 
                          height: barHeight, 
                          background: 'var(--primary)', 
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.5s ease-out'
                        }}
                      />
                      <span style={{ fontSize: '11px', marginTop: '8px', color: 'var(--text-muted)' }}>
                        {d.date.substring(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Bestsellers list */}
            <div className="admin-card">
              <h4 style={{ fontSize: '18px', marginBottom: '15px', color: 'var(--primary-dark)' }}>
                {t("Top 5 sản phẩm bán chạy nhất", "Top 5 Best-Selling Teas")}
              </h4>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>{t("Sản phẩm", "Product")}</th>
                      <th>{t("Số lượng đã bán", "Qty Sold")}</th>
                      <th>{t("Doanh thu", "Revenue")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bestsellers.map(b => (
                      <tr key={b.productId}>
                        <td><strong>{t(b.productName, b.productNameEN)}</strong></td>
                        <td>{b.quantitySold}</td>
                        <td>{formatPrice(b.totalRevenueVND, b.totalRevenueVND / 25000)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY STOCK */}
        {activeTab === 'inventory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div className="flex-between">
              <h2 style={{ color: 'var(--primary-dark)', fontSize: '28px', margin: 0 }}>
                {t("Quản lý tồn kho trà thảo mộc", "Inventory Stock Control")}
              </h2>
              <button onClick={handleSyncPOS} className="btn btn-outline" disabled={syncing}>
                <RefreshCw size={16} /> {syncing ? t("Đang đồng bộ...", "Syncing...") : t("Đồng bộ KiotViet/Sapo", "Sync KiotViet/Sapo")}
              </button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>{t("Trà thảo mộc", "Product Name")}</th>
                    <th>{t("Giá bán (VND)", "VND Price")}</th>
                    <th>{t("Giá bán (USD)", "USD Price")}</th>
                    <th>{t("Tồn kho hiện tại", "In-Stock")}</th>
                    <th>{t("Trạng thái", "Status")}</th>
                    <th>{t("Cập nhật kho nhanh", "Quick Update")}</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(p => (
                    <tr key={p.id}>
                      <td><strong>{t(p.name, p.nameEN)}</strong></td>
                      <td>{p.priceVND.toLocaleString()} đ</td>
                      <td>${p.priceUSD}</td>
                      <td>
                        <span style={{ fontWeight: '600', color: p.isLowStock ? 'red' : 'inherit' }}>
                          {p.StockQuantity ?? p.stockQuantity}
                        </span>
                      </td>
                      <td>
                        {p.isLowStock ? (
                          <span style={{ background: '#fef2f2', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                            {t("CẢNH BÁO: SẮP HẾT", "LOW STOCK ALERT")}
                          </span>
                        ) : (
                          <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                            {t("AN TOÀN", "SAFE")}
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input 
                            type="number" 
                            defaultValue={p.StockQuantity ?? p.stockQuantity} 
                            id={`stock-${p.id}`}
                            style={{ width: '80px', padding: '6px' }}
                          />
                          <button 
                            onClick={() => {
                              const input = document.getElementById(`stock-${p.id}`);
                              if (input) handleUpdateStock(p.id, parseInt(input.value));
                            }}
                            className="btn btn-primary"
                            style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '12px' }}
                          >
                            Lưu
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDER DUYET */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', fontSize: '28px', textAlign: 'left', margin: 0 }}>
              {t("Phê duyệt và Vận chuyển Đơn hàng", "Process & Fulfill Orders")}
            </h2>

            <div className="grid-3" style={{ gridTemplateColumns: '2fr 1.2fr' }}>
              {/* Order List Table */}
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>{t("Mã đơn", "Order Code")}</th>
                      <th>{t("Khách hàng", "Customer")}</th>
                      <th>{t("Ngày đặt", "Date")}</th>
                      <th>{t("Tổng tiền", "Total")}</th>
                      <th>{t("Trạng thái", "Status")}</th>
                      <th>{t("Thao tác", "Action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td><strong>{o.orderCode}</strong></td>
                        <td>{o.guestName}</td>
                        <td>{new Date(o.orderDate).toLocaleDateString()}</td>
                        <td>{formatPrice(o.totalAmountVND, o.totalAmountUSD)}</td>
                        <td>
                          <span 
                            style={{ 
                              padding: '4px 8px', 
                              borderRadius: '20px', 
                              fontSize: '11px', 
                              fontWeight: '600',
                              background: o.orderStatus === 'Completed' ? '#f0fdf4' : o.orderStatus === 'Pending' ? '#fffbeb' : '#fef2f2',
                              color: o.orderStatus === 'Completed' ? '#16a34a' : o.orderStatus === 'Pending' ? '#d97706' : '#ef4444'
                            }}
                          >
                            {o.orderStatus}
                          </span>
                        </td>
                        <td>
                          <button 
                            onClick={() => {
                              setSelectedOrder(o);
                              setTrackingCode(o.shippingTrackingCode || '');
                            }}
                            className="btn btn-outline"
                            style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '12px' }}
                          >
                            {t("Chi tiết", "Details")}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order Details Panel */}
              {selectedOrder ? (
                <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <h3 style={{ fontSize: '18px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                    {t("Chi tiết Đơn:", "Order Info:")} {selectedOrder.orderCode}
                  </h3>
                  <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p><strong>{t("Người nhận:", "Receiver:")}</strong> {selectedOrder.guestName}</p>
                    <p><strong>{t("SĐT:", "Phone:")}</strong> {selectedOrder.guestPhone}</p>
                    <p><strong>{t("Địa chỉ:", "Address:")}</strong> {selectedOrder.shippingAddress}</p>
                    <p><strong>{t("Hình thức thanh toán:", "Payment:")}</strong> {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})</p>
                  </div>

                  {/* Status update buttons */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                    <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                      {t("Cập nhật mã vận đơn (GHN/GHTK):", "Add tracking code (GHTK/GHN):")}
                    </label>
                    <input 
                      type="text" 
                      value={trackingCode}
                      onChange={e => setTrackingCode(e.target.value)}
                      placeholder="e.g. GHTK-8891283"
                      style={{ width: '100%', padding: '8px', fontSize: '13px', marginBottom: '15px' }}
                    />

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {selectedOrder.orderStatus === 'Pending' && (
                        <button onClick={() => handleUpdateStatus(selectedOrder.id, 'Confirmed')} className="btn btn-primary" style={{ padding: '8px 12px', fontSize: '12px' }}>
                          {t("Xác nhận đơn", "Confirm Order")}
                        </button>
                      )}
                      {selectedOrder.orderStatus === 'Confirmed' && (
                        <button onClick={() => handleUpdateStatus(selectedOrder.id, 'Shipping')} className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '12px' }}>
                          {t("Giao shipper", "Ship Order")}
                        </button>
                      )}
                      {selectedOrder.orderStatus === 'Shipping' && (
                        <button onClick={() => handleUpdateStatus(selectedOrder.id, 'Completed')} className="btn btn-primary" style={{ padding: '8px 12px', fontSize: '12px', background: 'green' }}>
                          {t("Hoàn thành đơn", "Complete Order")}
                        </button>
                      )}
                      {selectedOrder.orderStatus !== 'Completed' && selectedOrder.orderStatus !== 'Cancelled' && (
                        <button onClick={() => handleUpdateStatus(selectedOrder.id, 'Cancelled')} className="btn btn-outline" style={{ padding: '8px 12px', fontSize: '12px', color: 'red', borderColor: 'red' }}>
                          {t("Hủy đơn", "Cancel Order")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-center admin-card" style={{ color: 'var(--text-muted)', borderStyle: 'dashed' }}>
                  <p>{t("Vui lòng chọn 1 đơn hàng để xem chi tiết & phê duyệt.", "Select an order to view details.")}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: REVIEWS MODERATING */}
        {activeTab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', fontSize: '28px', textAlign: 'left', margin: 0 }}>
              {t("Kiểm duyệt Đánh giá Khách hàng", "Review Moderation Board")}
            </h2>

            {pendingReviews.length === 0 ? (
              <div className="flex-center admin-card" style={{ minHeight: '200px', borderStyle: 'dashed', color: 'var(--text-muted)' }}>
                <p>{t("Không có đánh giá nào đang chờ phê duyệt.", "No reviews awaiting approval.")}</p>
              </div>
            ) : (
              <div className="flex-column gap-20">
                {pendingReviews.map(r => (
                  <div key={r.id} className="admin-card" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    {r.imageURL && (
                      <img src={r.imageURL} alt="Review attachment" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                    )}
                    <div style={{ flexGrow: 1, textAlign: 'left' }}>
                      <strong style={{ fontSize: '16px', display: 'block', color: 'var(--primary-dark)' }}>
                        {r.guestName || r.userFullName || t("Khách vãng lai", "Guest Buyer")} - {r.rating} ⭐
                      </strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                        {t("Sản phẩm:", "Product:")} {r.productName} | {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                      <p style={{ fontSize: '14px', fontStyle: 'italic' }}>"{r.comment}"</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => handleApproveReview(r.id)} 
                        className="btn btn-primary"
                        style={{ padding: '8px', borderRadius: '50%', background: 'green' }}
                        title={t("Duyệt hiển thị", "Approve")}
                      >
                        <Check size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteReview(r.id)} 
                        className="btn btn-outline"
                        style={{ padding: '8px', borderRadius: '50%', color: 'red', borderColor: 'red' }}
                        title={t("Từ chối / Xóa", "Reject/Delete")}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
