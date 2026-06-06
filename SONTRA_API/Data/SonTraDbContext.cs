using Microsoft.EntityFrameworkCore;
using SONTRA_API.Models;
using System;

namespace SONTRA_API.Data
{
    public class SonTraDbContext : DbContext
    {
        public SonTraDbContext(DbContextOptions<SonTraDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<CustomerProfile> CustomerProfiles { get; set; } = null!;
        public DbSet<Address> Addresses { get; set; } = null!;
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<Ingredient> Ingredients { get; set; } = null!;
        public DbSet<ProductIngredient> ProductIngredients { get; set; } = null!;
        public DbSet<Order> Orders { get; set; } = null!;
        public DbSet<OrderDetail> OrderDetails { get; set; } = null!;
        public DbSet<GiftBox> GiftBoxes { get; set; } = null!;
        public DbSet<GiftBoxItem> GiftBoxItems { get; set; } = null!;
        public DbSet<Review> Reviews { get; set; } = null!;
        public DbSet<Blog> Blogs { get; set; } = null!;
        public DbSet<LoyaltyTransaction> LoyaltyTransactions { get; set; } = null!;
        public DbSet<Coupon> Coupons { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure compound key for ProductIngredient
            modelBuilder.Entity<ProductIngredient>()
                .HasKey(pi => new { pi.ProductId, pi.IngredientId });

            // Avoid multiple cascade delete paths in SQL Server
            modelBuilder.Entity<OrderDetail>()
                .HasOne(od => od.Product)
                .WithMany()
                .HasForeignKey(od => od.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<GiftBoxItem>()
                .HasOne(gbi => gbi.Product)
                .WithMany()
                .HasForeignKey(gbi => gbi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Product)
                .WithMany()
                .HasForeignKey(r => r.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<LoyaltyTransaction>()
                .HasOne(lt => lt.Order)
                .WithMany()
                .HasForeignKey(lt => lt.OrderId)
                .OnDelete(DeleteBehavior.Restrict);

            // Seed Users (Passwords are pre-hashed using SHA256)
            // admin123 -> 240eb0f5a83cd773f32467d3e098867a57a149c90eb21cf8b73fdfb55ec7f7c4
            // staff123 -> cb6cd7efc12ff357d622f6723226db2c78119eb46146ff9d8aa124ff39665bc7
            // market123 -> 2f53d4ebc335a122e23d1ff394df3c5000570bcf4769cf373dfa10526e85746b
            var staticDate = new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc);

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    FullName = "Chủ cửa hàng (Admin)",
                    Email = "admin@sontra.com",
                    PhoneNumber = "0900000001",
                    PasswordHash = "240eb0f5a83cd773f32467d3e098867a57a149c90eb21cf8b73fdfb55ec7f7c4",
                    Role = "Admin",
                    IsActive = true,
                    CreatedAt = staticDate
                },
                new User
                {
                    Id = 2,
                    FullName = "Nhân viên kho (Warehouse)",
                    Email = "warehouse@sontra.com",
                    PhoneNumber = "0900000002",
                    PasswordHash = "cb6cd7efc12ff357d622f6723226db2c78119eb46146ff9d8aa124ff39665bc7",
                    Role = "Warehouse",
                    IsActive = true,
                    CreatedAt = staticDate
                },
                new User
                {
                    Id = 3,
                    FullName = "Nhân viên duyệt đơn (Staff)",
                    Email = "staff@sontra.com",
                    PhoneNumber = "0900000003",
                    PasswordHash = "cb6cd7efc12ff357d622f6723226db2c78119eb46146ff9d8aa124ff39665bc7",
                    Role = "Staff",
                    IsActive = true,
                    CreatedAt = staticDate
                },
                new User
                {
                    Id = 4,
                    FullName = "Nhân viên truyền thông (Content)",
                    Email = "marketing@sontra.com",
                    PhoneNumber = "0900000004",
                    PasswordHash = "2f53d4ebc335a122e23d1ff394df3c5000570bcf4769cf373dfa10526e85746b",
                    Role = "Content",
                    IsActive = true,
                    CreatedAt = staticDate
                }
            );

            // Seed Products
            modelBuilder.Entity<Product>().HasData(
                new Product
                {
                    Id = 1,
                    Name = "Trà Êm (Hoa cúc, Kỷ tử)",
                    NameEN = "Em Tea (Chrysanthemum, Wolfberry)",
                    Slug = "tra-em-hoa-cuc-ky-tu",
                    Description = "Giúp thư giãn tinh thần, làm dịu lo âu và mang lại giấc ngủ dịu êm.",
                    DescriptionEN = "Relaxes the mind, calms anxiety, and brings a gentle sleep.",
                    PriceVND = 75000,
                    PriceUSD = 3.00m,
                    StockQuantity = 100,
                    ImageURL = "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
                    IsActive = true,
                    IsGiftBoxShell = false,
                    CreatedAt = staticDate
                },
                new Product
                {
                    Id = 2,
                    Name = "Trà Thanh (Bí đao, Hoa cúc, Táo đỏ...)",
                    NameEN = "Thanh Tea (Winter melon, Chrysanthemum...)",
                    Slug = "tra-thanh-mat-gan-giai-nhiet",
                    Description = "Giúp thanh nhiệt, giải độc gan, làm mát cơ thể cho ngày dài năng động.",
                    DescriptionEN = "Cools the liver, detoxifies, and refreshes the body for active days.",
                    PriceVND = 85000,
                    PriceUSD = 3.40m,
                    StockQuantity = 120,
                    ImageURL = "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop",
                    IsActive = true,
                    IsGiftBoxShell = false,
                    CreatedAt = staticDate
                },
                new Product
                {
                    Id = 3,
                    Name = "Trà Yên (Lạc tiên, Tâm sen, Lá dâu tằm)",
                    NameEN = "Yen Tea (Passionflower, Lotus seed core...)",
                    Slug = "tra-yen-ngu-ngon-sau-giac",
                    Description = "Trị mất ngủ kinh niên, giảm căng thẳng thần kinh, mang lại giấc ngủ sâu an lành.",
                    DescriptionEN = "Combats chronic insomnia, reduces nerve stress, and provides a deep peaceful sleep.",
                    PriceVND = 90000,
                    PriceUSD = 3.60m,
                    StockQuantity = 80,
                    ImageURL = "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=600&auto=format&fit=crop",
                    IsActive = true,
                    IsGiftBoxShell = false,
                    CreatedAt = staticDate
                },
                new Product
                {
                    Id = 4,
                    Name = "Trà Dịu (Atiso, Cam thảo)",
                    NameEN = "Diu Tea (Artichoke, Licorice)",
                    Slug = "tra-diu-ngot-hau-thanh-loc",
                    Description = "Vị ngọt thanh từ cam thảo kết hợp Atiso giúp lọc gan, dịu nhẹ đường ruột.",
                    DescriptionEN = "Mild sweet licorice combined with artichoke to purify liver and soothe digestive tract.",
                    PriceVND = 80000,
                    PriceUSD = 3.20m,
                    StockQuantity = 90,
                    ImageURL = "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=600&auto=format&fit=crop",
                    IsActive = true,
                    IsGiftBoxShell = false,
                    CreatedAt = staticDate
                },
                new Product
                {
                    Id = 5,
                    Name = "Vỏ Hộp Quà Tự Thiết Kế",
                    NameEN = "Custom Gift Box Case",
                    Slug = "vo-hop-qua-tu-thiet-ke",
                    Description = "Vỏ hộp quà rỗng kèm thiệp chúc mừng tự viết để bạn tùy chọn vị trà.",
                    DescriptionEN = "Empty gift box case with custom card for personalized selections.",
                    PriceVND = 30000,
                    PriceUSD = 1.20m,
                    StockQuantity = 1000,
                    ImageURL = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop",
                    IsActive = true,
                    IsGiftBoxShell = true,
                    CreatedAt = staticDate
                }
            );

            // Seed Ingredients
            modelBuilder.Entity<Ingredient>().HasData(
                new Ingredient
                {
                    Id = 1,
                    Name = "Hoa cúc",
                    NameEN = "Chrysanthemum",
                    OriginProvince = "Hưng Yên",
                    Latitude = 20.6464m,
                    Longitude = 106.0511m,
                    Description = "Hoa cúc sấy giòn tự nhiên.",
                    DescriptionEN = "Crispy dried natural chamomile flowers."
                },
                new Ingredient
                {
                    Id = 2,
                    Name = "Kỷ tử",
                    NameEN = "Goji Berry",
                    OriginProvince = "Ninh Thuận",
                    Latitude = 11.5684m,
                    Longitude = 108.9904m,
                    Description = "Hạt kỷ tử chín mọng phơi khô.",
                    DescriptionEN = "Ripe dried goji berries."
                },
                new Ingredient
                {
                    Id = 3,
                    Name = "Bí đao",
                    NameEN = "Winter Melon",
                    OriginProvince = "Đồng Nai",
                    Latitude = 10.9574m,
                    Longitude = 106.8427m,
                    Description = "Bí đao sấy khô giải nhiệt.",
                    DescriptionEN = "Dried winter melon slices."
                },
                new Ingredient
                {
                    Id = 4,
                    Name = "Lá dứa",
                    NameEN = "Pandan Leaf",
                    OriginProvince = "Lâm Đồng",
                    Latitude = 11.9404m,
                    Longitude = 108.4583m,
                    Description = "Lá dứa thơm sấy lạnh.",
                    DescriptionEN = "Aromatic cold-dried pandan leaves."
                },
                new Ingredient
                {
                    Id = 5,
                    Name = "Táo đỏ",
                    NameEN = "Red Date",
                    OriginProvince = "Ninh Bình",
                    Latitude = 20.2506m,
                    Longitude = 105.9744m,
                    Description = "Táo đỏ cắt lát giàu dinh dưỡng.",
                    DescriptionEN = "Sliced nutrient-rich red jujube dates."
                },
                new Ingredient
                {
                    Id = 6,
                    Name = "Lạc tiên",
                    NameEN = "Passion Flower",
                    OriginProvince = "Đà Nẵng",
                    Latitude = 16.1211m,
                    Longitude = 108.2783m,
                    Description = "Cây lạc tiên hoang dã hái ở bán đảo Sơn Trà.",
                    DescriptionEN = "Wild passionflower vine harvested from Son Tra peninsula."
                },
                new Ingredient
                {
                    Id = 7,
                    Name = "Tâm sen",
                    NameEN = "Lotus Plumule",
                    OriginProvince = "Đồng Tháp",
                    Latitude = 10.4542m,
                    Longitude = 105.6322m,
                    Description = "Tâm sen khô đắng nhẹ an thần.",
                    DescriptionEN = "Lotus seed core/plumule, naturally calming."
                },
                new Ingredient
                {
                    Id = 8,
                    Name = "Lá dâu tằm",
                    NameEN = "Mulberry Leaf",
                    OriginProvince = "Bắc Giang",
                    Latitude = 21.2731m,
                    Longitude = 106.1946m,
                    Description = "Lá dâu tằm non sấy ráo.",
                    DescriptionEN = "Young mulberry leaves, dried gently."
                },
                new Ingredient
                {
                    Id = 9,
                    Name = "Atiso",
                    NameEN = "Artichoke",
                    OriginProvince = "Lâm Đồng",
                    Latitude = 11.9404m,
                    Longitude = 108.4583m,
                    Description = "Hoa Atiso đỏ sấy chua thanh.",
                    DescriptionEN = "Tangy dried hibiscus/red artichoke flowers."
                },
                new Ingredient
                {
                    Id = 10,
                    Name = "Cam thảo",
                    NameEN = "Licorice Root",
                    OriginProvince = "Quảng Nam",
                    Latitude = 15.5872m,
                    Longitude = 107.9794m,
                    Description = "Rễ cam thảo xắt mỏng ngọt hậu.",
                    DescriptionEN = "Sweet sliced licorice root."
                }
            );

            // Seed ProductIngredients mapping
            modelBuilder.Entity<ProductIngredient>().HasData(
                // Êm: Hoa cúc (1), Kỷ tử (2)
                new ProductIngredient { ProductId = 1, IngredientId = 1 },
                new ProductIngredient { ProductId = 1, IngredientId = 2 },
                
                // Thanh: Bí đao (3), Hoa cúc (1), Kỷ tử (2), Lá dứa (4), Táo đỏ (5)
                new ProductIngredient { ProductId = 2, IngredientId = 3 },
                new ProductIngredient { ProductId = 2, IngredientId = 1 },
                new ProductIngredient { ProductId = 2, IngredientId = 2 },
                new ProductIngredient { ProductId = 2, IngredientId = 4 },
                new ProductIngredient { ProductId = 2, IngredientId = 5 },

                // Yên: Lạc tiên (6), Tâm sen (7), Lá dâu tằm (8)
                new ProductIngredient { ProductId = 3, IngredientId = 6 },
                new ProductIngredient { ProductId = 3, IngredientId = 7 },
                new ProductIngredient { ProductId = 3, IngredientId = 8 },

                // Dịu: Atiso (9), Cam thảo (10)
                new ProductIngredient { ProductId = 4, IngredientId = 9 },
                new ProductIngredient { ProductId = 4, IngredientId = 10 }
            );

            // Seed a default coupon
            modelBuilder.Entity<Coupon>().HasData(
                new Coupon
                {
                    Id = 1,
                    Code = "SONTRAFREE",
                    DiscountValue = 20000,
                    IsPercentage = false,
                    MinOrderVND = 100000,
                    StartDate = new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc),
                    EndDate = new DateTime(2027, 6, 1, 0, 0, 0, DateTimeKind.Utc),
                    UsageLimit = 1000,
                    UsedCount = 0,
                    IsActive = true
                }
            );
        }
    }
}
