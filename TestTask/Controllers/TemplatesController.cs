using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using TestTask.Models;
using System.Linq;
using System.Runtime.Intrinsics.X86;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace TestTask.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TemplatesController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public TemplatesController(DatabaseContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Template>>> Get()
        {
            var templates = await _context.Templates.Include(template => template.Statuses)
                .Include(template => template.Fields).ToListAsync();
            return templates;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Template>> Add(Template template)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (template.Statuses.Count(s => s.IsInitial) != 1)
            {
                return BadRequest(new {errors = new string[] {"Не указан начальный статус"}});
            }

            await _context.Templates.AddAsync(template);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Template), new {id = template.Id}, template);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(long id, Template template)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != template.Id)
            {
                return BadRequest("ID не совпадают");
            }

            if (template.Statuses.Count(s => s.IsInitial) != 1)
            {
                return BadRequest(new {errors = new string[] {"Не указан начальный статус"}});
            }

            var templateToUpdate = await
                _context.Templates.Include("Statuses").Include("Fields").SingleOrDefaultAsync(t => t.Id == id);

            templateToUpdate.Name = template.Name;
            templateToUpdate.Statuses = template.Statuses;
            templateToUpdate.Fields = template.Fields;
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}