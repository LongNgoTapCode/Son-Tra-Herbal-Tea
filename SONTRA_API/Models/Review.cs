using System;
using System.ComponentModel.DataAnnotations;

namespace SONTRA_API.Models
{
    public class Review
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int? UserId { get; set; }
        
        [MaxLength(100)]
        public string? GuestName { get; set; }
        
        public int Rating { get; set; }
        
        [MaxLength(1000)]
        public string? Comment { get; set; }
        
        [MaxLength(255)]
        public string? ImageURL { get; set; }
        
        public bool IsApproved { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Product? Product { get; set; }
        public User? User { get; set; }
    }
}
