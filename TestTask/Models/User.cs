using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using TestTask.CustomAttributes;
using TestTask.Enums;

namespace TestTask.Models
{
    public class User
    {
        public long Id { get; set; }

        [Required(ErrorMessage = "email не указан")]
        [ValidEmail(ErrorMessage = "Некорректный формат почты")]
        public string Email { get; set; }

        [DataType(DataType.Password)]
        [Required(ErrorMessage = "пароль не указан")]
        [StringLength(32, ErrorMessage = "Поле {0} должно иметь от {2} до {1} символов.",
            MinimumLength = 8)]
        [JsonIgnore]
        public string Password { get; set; }

        [Required(ErrorMessage = "роль пользователя не указана")]
        public UserRole Role { get; set; }
    }
}