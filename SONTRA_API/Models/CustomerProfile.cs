using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SONTRA_API.Models
{
    public class CustomerProfile
    {
        [Key]
        [ForeignKey("User")]
        public int UserId { get; set; }
        
        public int LoyaltyPoints { get; set; } = 0;
        
        [Required]
        [MaxLength(15)]
        public string MembershipTier { get; set; } = "Silver"; // Silver, Gold, Diamond
        
        // Navigation properties
        public User? User { get; set; }
    }
}
