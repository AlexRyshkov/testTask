using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using TestTask.Models;

namespace TestTask.CustomAttributes
{
    public class ValidEmailAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            return Helpers.IsValidEmail((string) value)
                ? ValidationResult.Success
                : new ValidationResult(string.Empty);
        }
    }
}