using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using TestTask.Models;

namespace TestTask.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public FilesController(DatabaseContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Client")]
        [HttpGet]
        public async Task<IActionResult> Download()
        {
            return BadRequest("Файл не указан");
        }

        [Authorize(Roles = "Client")]
        [HttpGet("{filename}")]
        public async Task<IActionResult> Download(string filename)
        {
            if (filename == null)
                return BadRequest("Файл не указан");

            var path = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot", filename);

            var memory = new MemoryStream();
            await using (var stream = new FileStream(path, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }

            memory.Position = 0;
            return File(memory, Helpers.GetContentType(path), Path.GetFileName(path));
        }
    }
}