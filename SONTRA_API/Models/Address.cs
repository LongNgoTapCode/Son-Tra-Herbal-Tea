using System.ComponentModel.DataAnnotations;

namespace SONTRA_API.Models
{
    public class Address
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        
        [Required]
        [MaxLength(150)]
        public string ReceiverName { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(15)]
        public string ReceiverPhone { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string Province { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string District { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string Ward { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(255)]
        public string SpecificAddress { get; set; } = string.Empty;
        
        public bool IsDefault { get; set; } = false;

        // Navigation
        public User? User { get; set; }
    }
}
