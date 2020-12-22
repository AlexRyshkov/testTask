using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using TestTask.Models;

namespace TestTask.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public LoginController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Login(User user)
        {
            var dbUser =
                await _context.Users.SingleOrDefaultAsync(u => u.Email == user.Email && u.Password == user.Password);
            if (dbUser == null)
            {
                return BadRequest(new {errors = new string[] {"Неправильное имя пользователя или пароль"}});
            }

            var identity = GetIdentity(dbUser);
            var now = DateTime.UtcNow;
            var jwt = new JwtSecurityToken(
                issuer: AuthSettings.ISSUER,
                audience: AuthSettings.AUDIENCE,
                notBefore: now,
                claims: identity.Claims,
                expires: now.Add(TimeSpan.FromMinutes(AuthSettings.LIFETIME)),
                signingCredentials: new SigningCredentials(AuthSettings.GetSymmetricSecurityKey(),
                    SecurityAlgorithms.HmacSha256));
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            return Ok(
                new
                {
                    accessToken = encodedJwt,
                    username = identity.Name,
                    role = dbUser.Role
                });
        }

        [Authorize]
        [HttpGet("validate")]
        public IActionResult ValidateToken()
        {
            return Ok();
        }

        private ClaimsIdentity GetIdentity(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, user.Email),
                new Claim(ClaimsIdentity.DefaultRoleClaimType, user.Role.ToString())
            };
            var claimsIdentity =
                new ClaimsIdentity(claims, "Token", ClaimsIdentity.DefaultNameClaimType,
                    ClaimsIdentity.DefaultRoleClaimType);
            return claimsIdentity;
        }
    }
}