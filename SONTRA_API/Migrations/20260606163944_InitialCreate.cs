using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SONTRA_API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Coupons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DiscountValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsPercentage = table.Column<bool>(type: "bit", nullable: false),
                    MaxDiscountVND = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    MinOrderVND = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UsageLimit = table.Column<int>(type: "int", nullable: false),
                    UsedCount = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coupons", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Ingredients",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    NameEN = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    OriginProvince = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Latitude = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Longitude = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DescriptionEN = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ingredients", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    NameEN = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DescriptionEN = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PriceVND = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PriceUSD = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    StockQuantity = table.Column<int>(type: "int", nullable: false),
                    ImageURL = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsGiftBoxShell = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true),
                    PasswordHash = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProductIngredients",
                columns: table => new
                {
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    IngredientId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductIngredients", x => new { x.ProductId, x.IngredientId });
                    table.ForeignKey(
                        name: "FK_ProductIngredients_Ingredients_IngredientId",
                        column: x => x.IngredientId,
                        principalTable: "Ingredients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductIngredients_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Addresses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ReceiverName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    ReceiverPhone = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    Province = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    District = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Ward = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SpecificAddress = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    IsDefault = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Addresses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Addresses_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Blogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TitleVI = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    TitleEN = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    ContentVI = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContentEN = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AuthorId = table.Column<int>(type: "int", nullable: false),
                    ImageURL = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Blogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Blogs_Users_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CustomerProfiles",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    LoyaltyPoints = table.Column<int>(type: "int", nullable: false),
                    MembershipTier = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerProfiles", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_CustomerProfiles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    GuestName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    GuestPhone = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    GuestEmail = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ShippingAddress = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    OrderDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    OrderStatus = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    TotalAmountVND = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TotalAmountUSD = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ShippingFeeVND = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ShippingFeeUSD = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PaymentMethod = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    PaymentStatus = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    ShippingTrackingCode = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CouponId = table.Column<int>(type: "int", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CancellationReason = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Coupons_CouponId",
                        column: x => x.CouponId,
                        principalTable: "Coupons",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Orders_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    GuestName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    ImageURL = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    IsApproved = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reviews_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Reviews_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "LoyaltyTransactions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    OrderId = table.Column<int>(type: "int", nullable: true),
                    PointsChanged = table.Column<int>(type: "int", nullable: false),
                    TransactionDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoyaltyTransactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LoyaltyTransactions_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LoyaltyTransactions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    UnitPriceVND = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    UnitPriceUSD = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderDetails_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderDetails_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "GiftBoxes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderDetailId = table.Column<int>(type: "int", nullable: false),
                    CardMessage = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    BoxSize = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GiftBoxes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GiftBoxes_OrderDetails_OrderDetailId",
                        column: x => x.OrderDetailId,
                        principalTable: "OrderDetails",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GiftBoxItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GiftBoxId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GiftBoxItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GiftBoxItems_GiftBoxes_GiftBoxId",
                        column: x => x.GiftBoxId,
                        principalTable: "GiftBoxes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GiftBoxItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Coupons",
                columns: new[] { "Id", "Code", "DiscountValue", "EndDate", "IsActive", "IsPercentage", "MaxDiscountVND", "MinOrderVND", "StartDate", "UsageLimit", "UsedCount" },
                values: new object[] { 1, "SONTRAFREE", 20000m, new DateTime(2027, 6, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, false, null, 100000m, new DateTime(2026, 6, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1000, 0 });

            migrationBuilder.InsertData(
                table: "Ingredients",
                columns: new[] { "Id", "Description", "DescriptionEN", "Latitude", "Longitude", "Name", "NameEN", "OriginProvince" },
                values: new object[,]
                {
                    { 1, "Hoa cúc sấy giòn tự nhiên.", "Crispy dried natural chamomile flowers.", 20.6464m, 106.0511m, "Hoa cúc", "Chrysanthemum", "Hưng Yên" },
                    { 2, "Hạt kỷ tử chín mọng phơi khô.", "Ripe dried goji berries.", 11.5684m, 108.9904m, "Kỷ tử", "Goji Berry", "Ninh Thuận" },
                    { 3, "Bí đao sấy khô giải nhiệt.", "Dried winter melon slices.", 10.9574m, 106.8427m, "Bí đao", "Winter Melon", "Đồng Nai" },
                    { 4, "Lá dứa thơm sấy lạnh.", "Aromatic cold-dried pandan leaves.", 11.9404m, 108.4583m, "Lá dứa", "Pandan Leaf", "Lâm Đồng" },
                    { 5, "Táo đỏ cắt lát giàu dinh dưỡng.", "Sliced nutrient-rich red jujube dates.", 20.2506m, 105.9744m, "Táo đỏ", "Red Date", "Ninh Bình" },
                    { 6, "Cây lạc tiên hoang dã hái ở bán đảo Sơn Trà.", "Wild passionflower vine harvested from Son Tra peninsula.", 16.1211m, 108.2783m, "Lạc tiên", "Passion Flower", "Đà Nẵng" },
                    { 7, "Tâm sen khô đắng nhẹ an thần.", "Lotus seed core/plumule, naturally calming.", 10.4542m, 105.6322m, "Tâm sen", "Lotus Plumule", "Đồng Tháp" },
                    { 8, "Lá dâu tằm non sấy ráo.", "Young mulberry leaves, dried gently.", 21.2731m, 106.1946m, "Lá dâu tằm", "Mulberry Leaf", "Bắc Giang" },
                    { 9, "Hoa Atiso đỏ sấy chua thanh.", "Tangy dried hibiscus/red artichoke flowers.", 11.9404m, 108.4583m, "Atiso", "Artichoke", "Lâm Đồng" },
                    { 10, "Rễ cam thảo xắt mỏng ngọt hậu.", "Sweet sliced licorice root.", 15.5872m, 107.9794m, "Cam thảo", "Licorice Root", "Quảng Nam" }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "CreatedAt", "Description", "DescriptionEN", "ImageURL", "IsActive", "IsGiftBoxShell", "Name", "NameEN", "PriceUSD", "PriceVND", "Slug", "StockQuantity" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 6, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Giúp thư giãn tinh thần, làm dịu lo âu và mang lại giấc ngủ dịu êm.", "Relaxes the mind, calms anxiety, and brings a gentle sleep.", "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop", true, false, "Trà Êm (Hoa cúc, Kỷ tử)", "Em Tea (Chrysanthemum, Wolfberry)", 3.00m, 75000m, "tra-em-hoa-cuc-ky-tu", 100 },
                    { 2, new DateTime(2026, 6, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Giúp thanh nhiệt, giải độc gan, làm mát cơ thể cho ngày dài năng động.", "Cools the liver, detoxifies, and refreshes the body for active days.", "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop", true, false, "Trà Thanh (Bí đao, Hoa cúc, Táo đỏ...)", "Thanh Tea (Winter melon, Chrysanthemum...)", 3.40m, 85000m, "tra-thanh-mat-gan-giai-nhiet", 120 },
                    { 3, new DateTime(2026, 6, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Trị mất ngủ kinh niên, giảm căng thẳng thần kinh, mang lại giấc ngủ sâu an lành.", "Combats chronic insomnia, reduces nerve stress, and provides a deep peaceful sleep.", "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=600&auto=format&fit=crop", true, false, "Trà Yên (Lạc tiên, Tâm sen, Lá dâu tằm)", "Yen Tea (Passionflower, Lotus seed core...)", 3.60m, 90000m, "tra-yen-ngu-ngon-sau-giac", 80 },
                    { 4, new DateTime(2026, 6, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Vị ngọt thanh từ cam thảo kết hợp Atiso giúp lọc gan, dịu nhẹ đường ruột.", "Mild sweet licorice combined with artichoke to purify liver and soothe digestive tract.", "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=600&auto=format&fit=crop", true, false, "Trà Dịu (Atiso, Cam thảo)", "Diu Tea (Artichoke, Licorice)", 3.20m, 80000m, "tra-diu-ngot-hau-thanh-loc", 90 },
                    { 5, new DateTime(2026, 6, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Vỏ hộp quà rỗng kèm thiệp chúc mừng tự viết để bạn tùy chọn vị trà.", "Empty gift box case with custom card for personalized selections.", "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop", true, true, "Vỏ Hộp Quà Tự Thiết Kế", "Custom Gift Box Case", 1.20m, 30000m, "vo-hop-qua-tu-thiet-ke", 1000 }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "PhoneNumber", "Role" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 6, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@sontra.com", "Chủ cửa hàng (Admin)", true, "240eb0f5a83cd773f32467d3e098867a57a149c90eb21cf8b73fdfb55ec7f7c4", "0900000001", "Admin" },
                    { 2, new DateTime(2026, 6, 1, 0, 0, 0, 0, DateTimeKind.Utc), "warehouse@sontra.com", "Nhân viên kho (Warehouse)", true, "cb6cd7efc12ff357d622f6723226db2c78119eb46146ff9d8aa124ff39665bc7", "0900000002", "Warehouse" },
                    { 3, new DateTime(2026, 6, 1, 0, 0, 0, 0, DateTimeKind.Utc), "staff@sontra.com", "Nhân viên duyệt đơn (Staff)", true, "cb6cd7efc12ff357d622f6723226db2c78119eb46146ff9d8aa124ff39665bc7", "0900000003", "Staff" },
                    { 4, new DateTime(2026, 6, 1, 0, 0, 0, 0, DateTimeKind.Utc), "marketing@sontra.com", "Nhân viên truyền thông (Content)", true, "2f53d4ebc335a122e23d1ff394df3c5000570bcf4769cf373dfa10526e85746b", "0900000004", "Content" }
                });

            migrationBuilder.InsertData(
                table: "ProductIngredients",
                columns: new[] { "IngredientId", "ProductId" },
                values: new object[,]
                {
                    { 1, 1 },
                    { 2, 1 },
                    { 1, 2 },
                    { 2, 2 },
                    { 3, 2 },
                    { 4, 2 },
                    { 5, 2 },
                    { 6, 3 },
                    { 7, 3 },
                    { 8, 3 },
                    { 9, 4 },
                    { 10, 4 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_UserId",
                table: "Addresses",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Blogs_AuthorId",
                table: "Blogs",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_GiftBoxes_OrderDetailId",
                table: "GiftBoxes",
                column: "OrderDetailId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GiftBoxItems_GiftBoxId",
                table: "GiftBoxItems",
                column: "GiftBoxId");

            migrationBuilder.CreateIndex(
                name: "IX_GiftBoxItems_ProductId",
                table: "GiftBoxItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_LoyaltyTransactions_OrderId",
                table: "LoyaltyTransactions",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_LoyaltyTransactions_UserId",
                table: "LoyaltyTransactions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetails_OrderId",
                table: "OrderDetails",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetails_ProductId",
                table: "OrderDetails",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CouponId",
                table: "Orders",
                column: "CouponId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserId",
                table: "Orders",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductIngredients_IngredientId",
                table: "ProductIngredients",
                column: "IngredientId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_ProductId",
                table: "Reviews",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserId",
                table: "Reviews",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Addresses");

            migrationBuilder.DropTable(
                name: "Blogs");

            migrationBuilder.DropTable(
                name: "CustomerProfiles");

            migrationBuilder.DropTable(
                name: "GiftBoxItems");

            migrationBuilder.DropTable(
                name: "LoyaltyTransactions");

            migrationBuilder.DropTable(
                name: "ProductIngredients");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropTable(
                name: "GiftBoxes");

            migrationBuilder.DropTable(
                name: "Ingredients");

            migrationBuilder.DropTable(
                name: "OrderDetails");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Coupons");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
