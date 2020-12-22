using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace TestTask.Models
{
    public class TemplateStatus
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public bool IsInitial { get; set; }
        public long TemplateId { get; set; }

        public Template Template { get; set; }
    }
}