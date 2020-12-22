using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using TestTask.CustomAttributes;

namespace TestTask.Models
{
    public class Application
    {
        public long Id { get; set; }

        [MinLength(1, ErrorMessage = "У заявки должно быть хотя бы одно поле")]
        public List<ApplicationField> Fields { get; set; }

        [Column(TypeName = "timestamptz")] public DateTime CreatedAt { get; set; }
        public User User { get; set; }
        public long UserId { get; set; }
        public TemplateStatus Status { get; set; }
        public long StatusId { get; set; }
        public Template Template { get; set; }
        public long TemplateId { get; set; }
    }
}