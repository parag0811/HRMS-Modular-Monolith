using HRMS.Core.Postgres.Helper;
using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Interfaces;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;
using EmployeeFeature.Application.DTO;
using EmployeeFeature.Application.Repository;
using EmployeeFeature.Domain;

namespace EmployeeFeature.Infrastructure
{
    public class EmployeeEntityConfigurator : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Employee>(entity =>
            {
                entity.ToTable("Employee");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasMaxLength(128);
                entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(128);

                entity.HasIndex(e => e.DocumentType);
                entity.HasIndex(e => e.UserId);

                // Specific indexes for Employee
                entity.HasIndex(e => e.EmployeeCode);
                entity.HasIndex(e => e.DepartmentId);
                entity.HasIndex(e => e.RoleId);

                entity.OwnsOne(e => e.UserContext);
            });
        }
    }

    public class EmployeeRepository : PostgresDbRepository<Employee>, IEmployeeRepository
    {
        public EmployeeRepository(
            PostgresDbContext context,
            ILogger<EmployeeRepository> logger,
            ITelemetryService telemetryService,
            IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor)
        {
        }

        public override string TableName { get; } = nameof(Employee);

        public override string GenerateId(Employee entity)
            => Guid.NewGuid().ToString();

        public Expression<Func<Employee, bool>> GetAllEmployeesQuery(GetAllEmployeesRequest request)
        {
            Expression<Func<Employee, bool>> filter =
                x => x.DocumentType == nameof(Employee);

            if (request.RequestParam == null)
                return filter;

            var employeeRequest = request.RequestParam;

            if (!string.IsNullOrEmpty(employeeRequest.EmployeeId))
                filter = filter.And(x => x.Id == employeeRequest.EmployeeId);

            if (!string.IsNullOrEmpty(employeeRequest.UserId))
                filter = filter.And(x => x.UserId == employeeRequest.UserId);

            if (!string.IsNullOrEmpty(employeeRequest.EmployeeCode))
                filter = filter.And(x => x.EmployeeCode == employeeRequest.EmployeeCode);
                
            if (!string.IsNullOrEmpty(employeeRequest.DepartmentId))
                filter = filter.And(x => x.DepartmentId == employeeRequest.DepartmentId);

            if (!string.IsNullOrEmpty(employeeRequest.RoleId))
                filter = filter.And(x => x.RoleId == employeeRequest.RoleId);

            if (!string.IsNullOrEmpty(employeeRequest.Status))
                filter = filter.And(x => x.Status == employeeRequest.Status);

            return filter;
        }

        public async Task<(IEnumerable<Employee> result, int count)>
            GetAllEmployeesWithCountAsync(GetAllEmployeesRequest request)
        {
            var orderBy =
                request.OrderByCriteria != null
                    ? OrderBy(request)
                    : x => x.ModifiedOn;

            return await GetItemsWithCountAsync(
                GetAllEmployeesQuery(request),
                request,
                orderBy);
        }

        public async Task<Employee?> GetEmployeeAsync(GetAllEmployeesRequest request)
        {
            return await GetItemAsync(GetAllEmployeesQuery(request));
        }
    }
}
