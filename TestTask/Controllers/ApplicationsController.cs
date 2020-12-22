using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using TestTask.Models;
using System.Linq;
using System.Runtime.Intrinsics.X86;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using TestTask.Enums;

namespace TestTask.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationsController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public ApplicationsController(DatabaseContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Application>>> Get()
        {
            var applications = await _context.Applications.Include(application => application.Fields)
                .ThenInclude(field => field.TemplateField)
                .Include(application => application.Template).ThenInclude(t => t.Statuses)
                .Include(application => application.Status).ToListAsync();
            return applications;
        }

        [Authorize]
        [HttpGet("{username}")]
        public async Task<ActionResult<IEnumerable<Application>>> Get(string username)
        {
            var applications = await _context.Applications.Where(application => application.User.Email == username)
                .Include(application => application.Fields)
                .Include(application => application.Template).ThenInclude(template => template.Fields)
                .Include(application => application.Status).ToListAsync();
            return applications;
        }

        [Authorize(Roles = "Client")]
        [HttpPost]
        public async Task<ActionResult<Application>> Add()
        {
            var templateId = int.Parse(HttpContext.Request.Form["templateId"].FirstOrDefault());
            var template = await _context.Templates.Where(t => t.Id == templateId).Include(t => t.Statuses)
                .SingleOrDefaultAsync();
            var application = new Application
            {
                Template = template
            };
            application.Fields = new List<ApplicationField>();
            foreach (var field in Request.Form)
            {
                if (field.Key == "templateId")
                {
                    continue;
                }

                application.Fields.Add(new ApplicationField
                {
                    TemplateFieldId = int.Parse(field.Key),
                    Value = field.Value
                });
            }

            if (HttpContext.Request.Form.Files.Count > 0)
            {
                foreach (var file in HttpContext.Request.Form.Files)
                {
                    var filename = $"({DateTime.Now.Ticks})" + file.FileName;
                    var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", filename);
                    await using (var fileStream = new FileStream(path, FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }

                    application.Fields.Add(new ApplicationField
                    {
                        TemplateFieldId = int.Parse(file.Name),
                        Value = filename
                    });
                }
            }

            var email = User.Identity.Name;
            var currentUser = _context.Users.First(user => user.Email == email);
            application.User = currentUser;
            application.CreatedAt = DateTime.Now;
            application.Status = application.Template.Statuses.Single(s => s.IsInitial);
            await _context.Applications.AddAsync(application);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Application), new {id = application.Id}, application);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("status")]
        public async Task<ActionResult<Application>> UpdateStatus(UpdateStatusDto updateStatus)
        {
            var application = await _context.Applications.FindAsync(updateStatus.ApplicationId);
            var status = await _context.TemplateStatuses.FindAsync(updateStatus.StatusId);
            if (application == null || status == null)
            {
                return BadRequest();
            }

            application.Status = status;
            await _context.SaveChangesAsync();
            return Ok();
        }

        public class UpdateStatusDto
        {
            public long ApplicationId { get; set; }
            public long StatusId { get; set; }
        }
    }
}