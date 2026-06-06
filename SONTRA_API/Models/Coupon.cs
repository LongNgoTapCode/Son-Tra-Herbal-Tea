using System;
using System.ComponentModel.DataAnnotations;

namespace SONTRA_API.Models
{
    public class Coupon
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Code { get; set; } = string.Empty;
        
        public decimal DiscountValue { get; set; }
        public bool IsPercentage { get; set; } = true;
        
        public decimal? MaxDiscountVND { get; set; }
        public decimal MinOrderVND { get; set; } = 0;
        
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        
        public int UsageLimit { get; set; } = 1;
        public int UsedCount { get; set; } = 0;
        
        public bool IsActive { get; set; } = true;
    }
}
