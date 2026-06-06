using System.ComponentModel.DataAnnotations;

namespace SONTRA_API.Models
{
    public class Ingredient
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string NameEN { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string OriginProvince { get; set; } = string.Empty;
        
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        
        public string? Description { get; set; }
        public string? DescriptionEN { get; set; }
    }
}
