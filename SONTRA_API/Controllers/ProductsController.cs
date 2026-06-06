using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SONTRA_API.Data;
using System.Linq;
using System.Threading.Tasks;

namespace SONTRA_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly SonTraDbContext _context;

        public ProductsController(SonTraDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products
                .Where(p => p.IsActive)
                .ToListAsync();
            return Ok(products);
        }

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetProductBySlug(string slug)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Slug == slug && p.IsActive);

            if (product == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm." });
            }

            var ingredients = await _context.ProductIngredients
                .Where(pi => pi.ProductId == product.Id)
                .Select(pi => pi.Ingredient)
                .ToListAsync();

            return Ok(new
            {
                product.Id,
                product.Name,
                product.NameEN,
                product.Slug,
                product.Description,
                product.DescriptionEN,
                product.PriceVND,
                product.PriceUSD,
                product.StockQuantity,
                product.ImageURL,
                product.IsGiftBoxShell,
                Ingredients = ingredients
            });
        }
    }
}
