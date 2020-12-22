using Microsoft.EntityFrameworkCore;
using Npgsql;
using TestTask.Enums;
using TestTask.Models;

namespace TestTask
{
    public class DatabaseContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Template> Templates { get; set; }
        public DbSet<TemplateField> TemplateFields { get; set; }
        public DbSet<TemplateStatus> TemplateStatuses { get; set; }
        public DbSet<Application> Applications { get; set; }
        public DbSet<ApplicationField> ApplicationFields { get; set; }

        static DatabaseContext()
        {
            NpgsqlConnection.GlobalTypeMapper.MapEnum<FieldType>();
            NpgsqlConnection.GlobalTypeMapper.MapEnum<UserRole>();
        }

        public DatabaseContext(DbContextOptions<DatabaseContext> options)
            : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=testTask;Username=postgres;Password=123456",
                o => o.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasPostgresEnum<FieldType>();
            modelBuilder.HasPostgresEnum<UserRole>();
            modelBuilder.Entity<User>().HasData(
                new User {Id = 1, Email = "admin1@gmail.com", Password = "12345678", Role = UserRole.Admin},
                new User {Id = 2, Email = "user1@gmail.com", Password = "12345678", Role = UserRole.Client});
        }
    }
}