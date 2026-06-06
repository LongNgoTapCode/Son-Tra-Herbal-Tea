using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SONTRA_API.Data;
using SONTRA_API.DTOs;
using SONTRA_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SONTRA_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly SonTraDbContext _context;

        public OrdersController(SonTraDbContext context)
        {
            _context = context;
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequest request)
        {
            if (request.Items == null || !request.Items.Any())
            {
                return BadRequest(new { message = "Giỏ hàng rỗng." });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Calculate prices
                decimal totalVND = 0;
                decimal totalUSD = 0;
                var orderDetailsList = new List<OrderDetail>();
                var giftBoxesList = new List<GiftBox>();

                foreach (var item in request.Items)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product == null || !product.IsActive)
                    {
                        return BadRequest(new { message = $"Sản phẩm với ID {item.ProductId} không tồn tại hoặc ngừng bán." });
                    }

                    // Check stock for shell box
                    if (product.StockQuantity < item.Quantity)
                    {
                        return BadRequest(new { message = $"Sản phẩm '{product.Name}' đã hết hàng hoặc không đủ tồn kho." });
                    }

                    product.StockQuantity -= item.Quantity; // Deduct shell/product stock

                    decimal itemPriceVND = product.PriceVND;
                    decimal itemPriceUSD = product.PriceUSD;

                    var detail = new OrderDetail
                    {
                        ProductId = product.Id,
                        Quantity = item.Quantity,
                        UnitPriceVND = itemPriceVND,
                        UnitPriceUSD = itemPriceUSD
                    };

                    totalVND += itemPriceVND * item.Quantity;
                    totalUSD += itemPriceUSD * item.Quantity;
                    orderDetailsList.Add(detail);

                    // If it is a custom gift box, process sub-items
                    if (item.IsGiftBox && product.IsGiftBoxShell)
                    {
                        var giftBox = new GiftBox
                        {
                            OrderDetail = detail,
                            CardMessage = item.CardMessage,
                            BoxSize = item.BoxSize ?? "Small",
                            GiftBoxItems = new List<GiftBoxItem>()
                        };

                        if (item.GiftItems != null)
                        {
                            foreach (var subItem in item.GiftItems)
                            {
                                var subProduct = await _context.Products.FindAsync(subItem.ProductId);
                                if (subProduct == null || !subProduct.IsActive || subProduct.IsGiftBoxShell)
                                {
                                    return BadRequest(new { message = $"Trà vị {subItem.ProductId} bỏ vào hộp quà không hợp lệ." });
                                }

                                if (subProduct.StockQuantity < subItem.Quantity * item.Quantity)
                                {
                                    return BadRequest(new { message = $"Vị trà '{subProduct.Name}' không đủ tồn kho." });
                                }

                                subProduct.StockQuantity -= subItem.Quantity * item.Quantity; // Deduct sub-product stock

                                giftBox.GiftBoxItems.Add(new GiftBoxItem
                                {
                                    ProductId = subProduct.Id,
                                    Quantity = subItem.Quantity
                                });
                            }
                        }
                        giftBoxesList.Add(giftBox);
                    }
                }

                // Apply coupon if exists
                Coupon? coupon = null;
                if (!string.IsNullOrEmpty(request.CouponCode))
                {
                    coupon = await _context.Coupons.FirstOrDefaultAsync(c => c.Code == request.CouponCode && c.IsActive);
                    if (coupon != null && DateTime.UtcNow >= coupon.StartDate && DateTime.UtcNow <= coupon.EndDate && coupon.UsedCount < coupon.UsageLimit)
                    {
                        if (totalVND >= coupon.MinOrderVND)
                        {
                            decimal discountVND = 0;
                            if (coupon.IsPercentage)
                            {
                                discountVND = totalVND * (coupon.DiscountValue / 100);
                                if (coupon.MaxDiscountVND.HasValue && discountVND > coupon.MaxDiscountVND.Value)
                                {
                                    discountVND = coupon.MaxDiscountVND.Value;
                                }
                            }
                            else
                            {
                                discountVND = coupon.DiscountValue;
                            }

                            totalVND -= discountVND;
                            // Convert discount to USD roughly (1 USD = 25000 VND)
                            totalUSD -= discountVND / 25000m;

                            if (totalVND < 0) totalVND = 0;
                            if (totalUSD < 0) totalUSD = 0;

                            coupon.UsedCount++;
                        }
                    }
                }

                // Shipping fee mockup
                decimal shippingFeeVND = 30000;
                decimal shippingFeeUSD = 1.20m;
                if (request.ShippingAddress.ToLower().Contains("hanoi") || request.ShippingAddress.ToLower().Contains("hồ chí minh") || request.ShippingAddress.ToLower().Contains("sài gòn"))
                {
                    shippingFeeVND = 40000;
                    shippingFeeUSD = 1.60m;
                }

                totalVND += shippingFeeVND;
                totalUSD += shippingFeeUSD;

                // Create Order
                var order = new Order
                {
                    UserId = request.UserId,
                    GuestName = request.GuestName,
                    GuestPhone = request.GuestPhone,
                    GuestEmail = request.GuestEmail,
                    ShippingAddress = request.ShippingAddress,
                    OrderStatus = "Pending",
                    PaymentMethod = request.PaymentMethod,
                    PaymentStatus = "Pending",
                    TotalAmountVND = totalVND,
                    TotalAmountUSD = totalUSD,
                    ShippingFeeVND = shippingFeeVND,
                    ShippingFeeUSD = shippingFeeUSD,
                    Coupon = coupon,
                    OrderDate = DateTime.UtcNow
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                // Generate OrderCode
                order.OrderCode = $"ST-{order.Id:D6}";
                await _context.SaveChangesAsync();

                // Save details & giftboxes
                foreach (var detail in orderDetailsList)
                {
                    detail.OrderId = order.Id;
                    _context.OrderDetails.Add(detail);
                }
                await _context.SaveChangesAsync();

                foreach (var giftBox in giftBoxesList)
                {
                    _context.GiftBoxes.Add(giftBox);
                }
                await _context.SaveChangesAsync();

                // Loyalty points: 10,000 VND = 1 point
                if (request.UserId.HasValue)
                {
                    var profile = await _context.CustomerProfiles.FindAsync(request.UserId.Value);
                    if (profile != null)
                    {
                        int pointsEarned = (int)(order.TotalAmountVND / 10000);
                        profile.LoyaltyPoints += pointsEarned;

                        // Tier updates
                        if (profile.LoyaltyPoints >= 1000) profile.MembershipTier = "Diamond";
                        else if (profile.LoyaltyPoints >= 500) profile.MembershipTier = "Gold";
                        else profile.MembershipTier = "Silver";

                        _context.LoyaltyTransactions.Add(new LoyaltyTransaction
                        {
                            UserId = request.UserId.Value,
                            OrderId = order.Id,
                            PointsChanged = pointsEarned,
                            TransactionDate = DateTime.UtcNow,
                            Description = $"Tích điểm từ đơn hàng {order.OrderCode}"
                        });
                        await _context.SaveChangesAsync();
                    }
                }

                await transaction.CommitAsync();

                // Generate payment details
                string paymentUrl = "";
                string qrCodeUrl = "";

                if (request.PaymentMethod == "VietQR")
                {
                    // VietQR standard API link: bank id: 970415 (Vietinbank), account: 113113113
                    string addInfo = Uri.EscapeDataString($"THANH TOAN DON HANG {order.OrderCode}");
                    qrCodeUrl = $"https://img.vietqr.io/image/970415-113113113-compact.jpg?amount={(int)order.TotalAmountVND}&addInfo={addInfo}&accountName=SON%20TRA%20HERBAL%20TEA";
                }
                else if (request.PaymentMethod == "MoMo")
                {
                    // Mock MoMo redirect link
                    paymentUrl = $"/checkout/momo-mock?orderId={order.Id}&amount={(int)order.TotalAmountVND}";
                }

                return Ok(new
                {
                    message = "Đơn hàng đã được tạo thành công.",
                    orderId = order.Id,
                    orderCode = order.OrderCode,
                    totalVND = order.TotalAmountVND,
                    totalUSD = order.TotalAmountUSD,
                    paymentMethod = order.PaymentMethod,
                    qrCodeUrl,
                    paymentUrl
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi tạo đơn hàng.", error = ex.Message });
            }
        }

        [HttpGet("{orderCode}")]
        public async Task<IActionResult> GetOrderByCode(string orderCode)
        {
            var order = await _context.Orders
                .Include(o => o.Coupon)
                .FirstOrDefaultAsync(o => o.OrderCode == orderCode);

            if (order == null)
            {
                return NotFound(new { message = "Không tìm thấy đơn hàng." });
            }

            var details = await _context.OrderDetails
                .Where(od => od.OrderId == order.Id)
                .Include(od => od.Product)
                .Select(od => new
                {
                    od.Id,
                    od.ProductId,
                    ProductName = od.Product != null ? od.Product.Name : "",
                    ProductNameEN = od.Product != null ? od.Product.NameEN : "",
                    od.Quantity,
                    od.UnitPriceVND,
                    od.UnitPriceUSD,
                    GiftBox = _context.GiftBoxes
                        .Where(gb => gb.OrderDetailId == od.Id)
                        .Select(gb => new
                        {
                            gb.Id,
                            gb.BoxSize,
                            gb.CardMessage,
                            Items = _context.GiftBoxItems
                                .Where(gbi => gbi.GiftBoxId == gb.Id)
                                .Include(gbi => gbi.Product)
                                .Select(gbi => new
                                {
                                    gbi.ProductId,
                                    ProductName = gbi.Product != null ? gbi.Product.Name : "",
                                    gbi.Quantity
                                }).ToList()
                        }).FirstOrDefault()
                }).ToListAsync();

            return Ok(new
            {
                order.Id,
                order.OrderCode,
                order.GuestName,
                order.GuestPhone,
                order.GuestEmail,
                order.ShippingAddress,
                order.OrderDate,
                order.OrderStatus,
                order.TotalAmountVND,
                order.TotalAmountUSD,
                order.ShippingFeeVND,
                order.ShippingFeeUSD,
                order.PaymentMethod,
                order.PaymentStatus,
                order.ShippingTrackingCode,
                couponCode = order.Coupon != null ? order.Coupon.Code : null,
                order.Notes,
                Details = details
            });
        }

        [HttpPost("shipping-fee")]
        public IActionResult CalculateShippingFee([FromBody] Dictionary<string, string> request)
        {
            decimal feeVND = 30000;
            decimal feeUSD = 1.20m;

            if (request.TryGetValue("province", out string? province) && !string.IsNullOrEmpty(province))
            {
                string prov = province.ToLower();
                if (prov.Contains("hà nội") || prov.Contains("hanoi") || prov.Contains("hồ chí minh") || prov.Contains("ho chi minh") || prov.Contains("sài gòn"))
                {
                    feeVND = 40000;
                    feeUSD = 1.60m;
                }
            }

            return Ok(new { shippingFeeVND = feeVND, shippingFeeUSD = feeUSD });
        }
    }
}
