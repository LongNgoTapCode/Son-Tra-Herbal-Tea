using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SONTRA_API.Data;
using SONTRA_API.DTOs;
using SONTRA_API.Models;
using SONTRA_API.Utils;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SONTRA_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly SonTraDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(SonTraDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || !PasswordHasher.VerifyPassword(request.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });
            }

            if (!user.IsActive)
            {
                return BadRequest(new { message = "Tài khoản của bạn đã bị khóa." });
            }

            var token = GenerateJwtToken(user);

            return Ok(new LoginResponse
            {
                Token = token,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role
            });
        }

        [HttpPost("register-passive")]
        public async Task<IActionResult> RegisterPassive([FromBody] RegisterPassiveRequest request)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (existingUser != null)
            {
                return Ok(new { message = "Tài khoản đã tồn tại.", userId = existingUser.Id });
            }

            var randomPassword = Guid.NewGuid().ToString("N").Substring(0, 10);
            var passwordHash = PasswordHasher.HashPassword(randomPassword);

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                PasswordHash = passwordHash,
                Role = "Customer",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var profile = new CustomerProfile
            {
                UserId = user.Id,
                LoyaltyPoints = 0,
                MembershipTier = "Silver"
            };
            _context.CustomerProfiles.Add(profile);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Tài khoản phụ đã tạo thành công.", userId = user.Id });
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? "SonTraHerbalTeaSecretKeySuperSecureKey123!");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.FullName),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
