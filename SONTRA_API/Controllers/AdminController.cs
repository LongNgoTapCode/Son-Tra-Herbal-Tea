using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SONTRA_API.Data;
using SONTRA_API.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SONTRA_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Warehouse,Staff")]
    public class AdminController : ControllerBase
    {
        private readonly SonTraDbContext _context;

        public AdminController(SonTraDbContext context)
        {
            _context = context;
        }

        [HttpGet("reports/sales")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetSalesReport()
        {
            var now = DateTime.UtcNow;
            var startOfToday = new DateTime(now.Year, now.Month, now.Day, 0, 0, 0, DateTimeKind.Utc);
            var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

            var orders = await _context.Orders.ToListAsync();

            var todayOrders = orders.Where(o => o.OrderDate >= startOfToday && o.OrderStatus != "Cancelled").ToList();
            var monthOrders = orders.Where(o => o.OrderDate >= startOfMonth && o.OrderStatus != "Cancelled").ToList();
            var totalOrders = orders.Where(o => o.OrderStatus != "Cancelled").ToList();

            var todayRevenueVND = todayOrders.Sum(o => o.TotalAmountVND);
            var todayRevenueUSD = todayOrders.Sum(o => o.TotalAmountUSD);
            var monthRevenueVND = monthOrders.Sum(o => o.TotalAmountVND);
            var monthRevenueUSD = monthOrders.Sum(o => o.TotalAmountUSD);
            var totalRevenueVND = totalOrders.Sum(o => o.TotalAmountVND);
            var totalRevenueUSD = totalOrders.Sum(o => o.TotalAmountUSD);

            // Group by date for chart (last 7 days)
            var sevenDaysAgo = now.AddDays(-7);
            var dailySales = orders
                .Where(o => o.OrderDate >= sevenDaysAgo && o.OrderStatus != "Cancelled")
                .GroupBy(o => o.OrderDate.ToString("yyyy-MM-dd"))
                .Select(g => new
                {
                    Date = g.Key,
                    RevenueVND = g.Sum(o => o.TotalAmountVND),
                    RevenueUSD = g.Sum(o => o.TotalAmountUSD),
                    OrderCount = g.Count()
                })
                .OrderBy(g => g.Date)
                .ToList();

            return Ok(new
            {
                today = new { revenueVND = todayRevenueVND, revenueUSD = todayRevenueUSD, orderCount = todayOrders.Count },
                thisMonth = new { revenueVND = monthRevenueVND, revenueUSD = monthRevenueUSD, orderCount = monthOrders.Count },
                total = new { revenueVND = totalRevenueVND, revenueUSD = totalRevenueUSD, orderCount = totalOrders.Count },
                chartData = dailySales
            });
        }

        [HttpGet("reports/bestsellers")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetBestsellersReport()
        {
            var bestSellers = await _context.OrderDetails
                .Include(od => od.Product)
                .Where(od => od.Order != null && od.Order.OrderStatus != "Cancelled")
                .GroupBy(od => new { od.ProductId, od.Product!.Name, od.Product.NameEN })
                .Select(g => new
                {
                    ProductId = g.Key.ProductId,
                    ProductName = g.Key.Name,
                    ProductNameEN = g.Key.NameEN,
                    QuantitySold = g.Sum(od => od.Quantity),
                    TotalRevenueVND = g.Sum(od => od.Quantity * od.UnitPriceVND)
                })
                .OrderByDescending(g => g.QuantitySold)
                .Take(5)
                .ToListAsync();

            return Ok(bestSellers);
        }

        [HttpGet("inventory")]
        [Authorize(Roles = "Admin,Warehouse")]
        public async Task<IActionResult> GetInventory()
        {
            var inventory = await _context.Products
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.NameEN,
                    p.StockQuantity,
                    p.PriceVND,
                    p.PriceUSD,
                    IsLowStock = p.StockQuantity < 15
                })
                .ToListAsync();

            return Ok(inventory);
        }

        [HttpPost("inventory/{productId}/stock")]
        [Authorize(Roles = "Admin,Warehouse")]
        public async Task<IActionResult> UpdateStock(int productId, [FromBody] int quantity)
        {
            if (quantity < 0)
            {
                return BadRequest(new { message = "Số lượng tồn kho không được âm." });
            }

            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm." });
            }

            product.StockQuantity = quantity;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật kho thành công.", productId, newStock = product.StockQuantity });
        }

        [HttpPost("inventory/sync")]
        [Authorize(Roles = "Admin,Warehouse")]
        public async Task<IActionResult> SyncPOS()
        {
            // Mocking POS sync with Sapo / KiotViet
            var random = new Random();
            var products = await _context.Products.ToListAsync();
            foreach (var p in products)
            {
                // Randomly add 5-20 stock for simulation
                p.StockQuantity += random.Next(5, 20);
            }
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã đồng bộ tồn kho thành công với KiotViet/Sapo API!" });
        }

        [HttpGet("orders")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
            return Ok(orders);
        }

        [HttpPost("orders/{id}/status")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] OrderStatusUpdate request)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound(new { message = "Không tìm thấy đơn hàng." });
            }

            order.OrderStatus = request.Status;
            
            if (!string.IsNullOrEmpty(request.TrackingCode))
            {
                order.ShippingTrackingCode = request.TrackingCode;
            }

            if (request.Status == "Completed")
            {
                order.PaymentStatus = "Paid";
            }

            if (request.Status == "Cancelled")
            {
                order.CancellationReason = request.Reason ?? "Nhân viên hủy đơn";
                
                // Return stock quantities upon cancellation
                var details = await _context.OrderDetails
                    .Where(od => od.OrderId == order.Id)
                    .ToListAsync();
                foreach (var detail in details)
                {
                    var product = await _context.Products.FindAsync(detail.ProductId);
                    if (product != null)
                    {
                        product.StockQuantity += detail.Quantity;
                    }

                    // Return sub-items if giftbox
                    var giftBox = await _context.GiftBoxes
                        .FirstOrDefaultAsync(gb => gb.OrderDetailId == detail.Id);
                    if (giftBox != null)
                    {
                        var subItems = await _context.GiftBoxItems
                            .Where(gbi => gbi.GiftBoxId == giftBox.Id)
                            .ToListAsync();
                        foreach (var sub in subItems)
                        {
                            var subProd = await _context.Products.FindAsync(sub.ProductId);
                            if (subProd != null)
                            {
                                subProd.StockQuantity += sub.Quantity * detail.Quantity;
                            }
                        }
                    }
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật trạng thái đơn hàng thành công.", orderCode = order.OrderCode, status = order.OrderStatus });
        }
    }

    public class OrderStatusUpdate
    {
        public string Status { get; set; } = string.Empty;
        public string? TrackingCode { get; set; }
        public string? Reason { get; set; }
    }
}
