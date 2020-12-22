using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using TestTask.CustomAttributes;

namespace TestTask.Models
{
    public class ApplicationField
    {
        public long Id { get; set; }

        [MinLength(1, ErrorMessage = "Значения полей не могут быть пустыми")]
        public string Value { get; set; }

        [MinLength(1, ErrorMessage = "Для поля не указано поле шаблона")]
        public TemplateField TemplateField { get; set; }

        public long TemplateFieldId { get; set; }

        [MinLength(1, ErrorMessage = "Для поля не указана заявка")]
        public Application Application { get; set; }

        public long ApplicationId { get; set; }
    }
}