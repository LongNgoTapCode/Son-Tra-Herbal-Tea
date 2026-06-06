using System;
using System.ComponentModel.DataAnnotations;

namespace SONTRA_API.Models
{
    public class Blog
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(250)]
        public string TitleVI { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(250)]
        public string TitleEN { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(250)]
        public string Slug { get; set; } = string.Empty;
        
        [Required]
        public string ContentVI { get; set; } = string.Empty;
        
        [Required]
        public string ContentEN { get; set; } = string.Empty;
        
        public int AuthorId { get; set; }
        
        [MaxLength(255)]
        public string? ImageURL { get; set; }
        
        public bool IsPublished { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public User? Author { get; set; }
    }
}
