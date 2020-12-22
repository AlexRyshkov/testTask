using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestTask
{
    public class AuthSettings
    {
        public const string ISSUER = "TestTask";
        public const string AUDIENCE = "TestTask";
        const string KEY = "secretkeysgvvavgegagegnnegsdgfs234tfsdfxdbf";
        public const int LIFETIME = 60;

        public static SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(KEY));
        }
    }
}