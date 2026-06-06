using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SONTRA_API.DTOs
{
    public class CheckoutRequest
    {
        public int? UserId { get; set; }
        
        [Required]
        public string GuestName { get; set; } = string.Empty;
        
        [Required]
        public string GuestPhone { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string GuestEmail { get; set; } = string.Empty;
        
        [Required]
        public string ShippingAddress { get; set; } = string.Empty;
        
        [Required]
        public string PaymentMethod { get; set; } = "COD"; // COD, VietQR, MoMo
        
        public string? CouponCode { get; set; }
        
        [Required]
        public List<CheckoutItem> Items { get; set; } = new();
    }

    public class CheckoutItem
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        
        public bool IsGiftBox { get; set; }
        public string? CardMessage { get; set; }
        public string? BoxSize { get; set; } // Small, Large
        public List<GiftBoxSubItem>? GiftItems { get; set; }
    }

    public class GiftBoxSubItem
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
