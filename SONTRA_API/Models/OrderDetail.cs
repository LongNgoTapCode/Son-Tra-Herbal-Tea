namespace SONTRA_API.Models
{
    public class OrderDetail
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPriceVND { get; set; }
        public decimal UnitPriceUSD { get; set; }

        // Navigation
        public Order? Order { get; set; }
        public Product? Product { get; set; }
        public GiftBox? GiftBox { get; set; }
    }
}
