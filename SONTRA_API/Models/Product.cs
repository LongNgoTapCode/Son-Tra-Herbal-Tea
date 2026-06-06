using System;
using System.ComponentModel.DataAnnotations;

namespace SONTRA_API.Models
{
    public class Product
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(150)]
        public string NameEN { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(150)]
        public string Slug { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        public string? DescriptionEN { get; set; }
        
        public decimal PriceVND { get; set; }
        public decimal PriceUSD { get; set; }
        
        public int StockQuantity { get; set; }
        
        [MaxLength(255)]
        public string? ImageURL { get; set; }
        
        public bool IsActive { get; set; } = true;
        public bool IsGiftBoxShell { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
