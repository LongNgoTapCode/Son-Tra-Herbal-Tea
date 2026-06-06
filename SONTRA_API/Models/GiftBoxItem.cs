namespace SONTRA_API.Models
{
    public class GiftBoxItem
    {
        public int Id { get; set; }
        public int GiftBoxId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; } = 1;

        // Navigation
        public GiftBox? GiftBox { get; set; }
        public Product? Product { get; set; }
    }
}
