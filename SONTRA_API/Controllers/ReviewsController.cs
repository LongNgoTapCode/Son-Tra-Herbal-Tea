using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SONTRA_API.Data;
using SONTRA_API.Models;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SONTRA_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly SonTraDbContext _context;

        public ReviewsController(SonTraDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateReview([FromBody] Review review)
        {
            if (review.Rating < 1 || review.Rating > 5)
            {
                return BadRequest(new { message = "Đánh giá phải từ 1 đến 5 sao." });
            }

            var product = await _context.Products.FindAsync(review.ProductId);
            if (product == null)
            {
                return BadRequest(new { message = "Sản phẩm không tồn tại." });
            }

            review.IsApproved = false; // Requires moderation
            review.CreatedAt = DateTime.UtcNow;

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đánh giá của bạn đã được gửi và đang chờ kiểm duyệt." });
        }

        [HttpGet("{productId}")]
        public async Task<IActionResult> GetApprovedReviews(int productId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.ProductId == productId && r.IsApproved)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new
                {
                    r.Id,
                    r.Rating,
                    r.Comment,
                    r.ImageURL,
                    r.CreatedAt,
                    r.GuestName,
                    UserFullName = r.User != null ? r.User.FullName : null
                })
                .ToListAsync();

            return Ok(reviews);
        }

        [HttpGet("pending")]
        [Authorize(Roles = "Admin,Content")]
        public async Task<IActionResult> GetPendingReviews()
        {
            var reviews = await _context.Reviews
                .Where(r => !r.IsApproved)
                .Include(r => r.Product)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new
                {
                    r.Id,
                    r.Rating,
                    r.Comment,
                    r.ImageURL,
                    r.CreatedAt,
                    r.GuestName,
                    ProductName = r.Product != null ? r.Product.Name : "",
                    UserFullName = r.User != null ? r.User.FullName : null
                })
                .ToListAsync();

            return Ok(reviews);
        }

        [HttpPost("{id}/approve")]
        [Authorize(Roles = "Admin,Content")]
        public async Task<IActionResult> ApproveReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound(new { message = "Không tìm thấy đánh giá." });
            }

            review.IsApproved = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã duyệt đánh giá thành công." });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Content")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound(new { message = "Không tìm thấy đánh giá." });
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa đánh giá thành công." });
        }
    }
}
