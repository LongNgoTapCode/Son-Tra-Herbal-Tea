using System;
using System.ComponentModel.DataAnnotations;

namespace SONTRA_API.Models
{
    public class LoyaltyTransaction
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int? OrderId { get; set; }
        public int PointsChanged { get; set; }
        public DateTime TransactionDate { get; set; } = DateTime.UtcNow;
        
        [MaxLength(255)]
        public string? Description { get; set; }

        // Navigation
        public User? User { get; set; }
        public Order? Order { get; set; }
    }
}
