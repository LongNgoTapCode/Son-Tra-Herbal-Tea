using System;
using System.ComponentModel.DataAnnotations;

namespace SONTRA_API.Models
{
    public class Order
    {
        public int Id { get; set; }
        
        [MaxLength(20)]
        public string? OrderCode { get; set; } // E.g., ST-000001
        
        public int? UserId { get; set; }
        
        [Required]
        [MaxLength(150)]
        public string GuestName { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(15)]
        public string GuestPhone { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string GuestEmail { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(500)]
        public string ShippingAddress { get; set; } = string.Empty;
        
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        
        [Required]
        [MaxLength(20)]
        public string OrderStatus { get; set; } = "Pending"; // Pending, Confirmed, Shipping, Completed, Cancelled
        
        public decimal TotalAmountVND { get; set; }
        public decimal TotalAmountUSD { get; set; }
        
        public decimal ShippingFeeVND { get; set; }
        public decimal ShippingFeeUSD { get; set; }
        
        [Required]
        [MaxLength(20)]
        public string PaymentMethod { get; set; } = "COD"; // COD, VietQR, MoMo
        
        [Required]
        [MaxLength(20)]
        public string PaymentStatus { get; set; } = "Pending"; // Pending, Paid, Failed
        
        [MaxLength(100)]
        public string? ShippingTrackingCode { get; set; }
        
        public int? CouponId { get; set; }
        
        [MaxLength(255)]
        public string? Notes { get; set; }
        
        [MaxLength(255)]
        public string? CancellationReason { get; set; }

        // Navigation
        public User? User { get; set; }
        public Coupon? Coupon { get; set; }
    }
}
