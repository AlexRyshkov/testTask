using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using TestTask.CustomAttributes;
using TestTask.Enums;

namespace TestTask.Models
{
    public class TemplateField
    {
        public long Id { get; set; }

        [Required(ErrorMessage = "не указан порядковый номер поля")]
        public int Order { get; set; }

        [Required(ErrorMessage = "Название поля не может быть пустым")]
        public string Name { get; set; }

        public FieldType Type { get; set; }

        public long TemplateId { get; set; }

        public Template Template { get; set; }
    }
}