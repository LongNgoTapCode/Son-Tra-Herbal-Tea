using System;
using System.ComponentModel.DataAnnotations;

namespace SONTRA_API.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(150)]
        public string FullName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;
        
        [MaxLength(15)]
        public string? PhoneNumber { get; set; }
        
        [Required]
        [MaxLength(255)]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(20)]
        public string Role { get; set; } = "Customer"; // Admin, Warehouse, Staff, Content, Customer
        
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public CustomerProfile? CustomerProfile { get; set; }
    }
}
