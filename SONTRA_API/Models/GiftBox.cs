using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SONTRA_API.Models
{
    public class GiftBox
    {
        public int Id { get; set; }
        public int OrderDetailId { get; set; }
        
        [MaxLength(500)]
        public string? CardMessage { get; set; }
        
        [Required]
        [MaxLength(10)]
        public string BoxSize { get; set; } = "Small"; // Small, Large
        
        // Navigation
        public OrderDetail? OrderDetail { get; set; }
        public List<GiftBoxItem> GiftBoxItems { get; set; } = new();
    }
}
