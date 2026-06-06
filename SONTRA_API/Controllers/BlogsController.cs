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
    public class BlogsController : ControllerBase
    {
        private readonly SonTraDbContext _context;

        public BlogsController(SonTraDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetPublishedBlogs()
        {
            var blogs = await _context.Blogs
                .Where(b => b.IsPublished)
                .OrderByDescending(b => b.CreatedAt)
                .Include(b => b.Author)
                .Select(b => new
                {
                    b.Id,
                    b.TitleVI,
                    b.TitleEN,
                    b.Slug,
                    b.ImageURL,
                    b.CreatedAt,
                    AuthorName = b.Author != null ? b.Author.FullName : ""
                })
                .ToListAsync();

            return Ok(blogs);
        }

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBlogBySlug(string slug)
        {
            var blog = await _context.Blogs
                .Include(b => b.Author)
                .FirstOrDefaultAsync(b => b.Slug == slug);

            if (blog == null)
            {
                return NotFound(new { message = "Không tìm thấy bài viết." });
            }

            if (!blog.IsPublished && !User.Identity?.IsAuthenticated == true)
            {
                return Unauthorized(new { message = "Bài viết chưa được xuất bản." });
            }

            return Ok(new
            {
                blog.Id,
                blog.TitleVI,
                blog.TitleEN,
                blog.Slug,
                blog.ContentVI,
                blog.ContentEN,
                blog.ImageURL,
                blog.IsPublished,
                blog.CreatedAt,
                AuthorName = blog.Author != null ? blog.Author.FullName : ""
            });
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Content")]
        public async Task<IActionResult> CreateOrUpdateBlog([FromBody] Blog blog)
        {
            if (string.IsNullOrEmpty(blog.Slug))
            {
                blog.Slug = Guid.NewGuid().ToString("N").Substring(0, 10);
            }

            // Get current user ID
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }
            int authorId = int.Parse(userIdClaim.Value);

            if (blog.Id == 0) // Create
            {
                blog.AuthorId = authorId;
                blog.CreatedAt = DateTime.UtcNow;
                _context.Blogs.Add(blog);
            }
            else // Update
            {
                var existing = await _context.Blogs.FindAsync(blog.Id);
                if (existing == null)
                {
                    return NotFound(new { message = "Không tìm thấy bài viết để cập nhật." });
                }

                existing.TitleVI = blog.TitleVI;
                existing.TitleEN = blog.TitleEN;
                existing.Slug = blog.Slug;
                existing.ContentVI = blog.ContentVI;
                existing.ContentEN = blog.ContentEN;
                existing.ImageURL = blog.ImageURL;
                existing.IsPublished = blog.IsPublished;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Lưu bài viết thành công." });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Content")]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null)
            {
                return NotFound(new { message = "Không tìm thấy bài viết." });
            }

            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa bài viết thành công." });
        }
    }
}
