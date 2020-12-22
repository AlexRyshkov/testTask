using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using TestTask.CustomAttributes;

namespace TestTask.Models
{
    public class Template
    {
        public long Id { get; set; }

        [Required(ErrorMessage = "Название шаблона не может быть пустым")]
        public string Name { get; set; }

        [MinLength(1, ErrorMessage = "У шаблона должно быть хотя бы одно поле")]
        public List<TemplateField> Fields { get; set; }

        [MinLength(1, ErrorMessage = "У шаблона должен быть хотя бы один статус")]
        public List<TemplateStatus> Statuses { get; set; }
    }
}