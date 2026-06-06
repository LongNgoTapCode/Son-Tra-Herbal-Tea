using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SONTRA_API.Data;
using System.Threading.Tasks;

namespace SONTRA_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IngredientsController : ControllerBase
    {
        private readonly SonTraDbContext _context;

        public IngredientsController(SonTraDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetIngredients()
        {
            var ingredients = await _context.Ingredients.ToListAsync();
            return Ok(ingredients);
        }
    }
}
