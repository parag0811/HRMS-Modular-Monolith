using HRMS.Core.Postgres.Helper;
using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Interfaces;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;
using LeaveFeature.Application.DTO;
using LeaveFeature.Application.Repository;
using LeaveFeature.Domain;

namespace LeaveFeature.Infrastructure
{
    public class LeaveEntityConfigurator : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Leave>(entity =>
            {
                entity.ToTable("Leave");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasMaxLength(128);
                entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(128);

                entity.HasIndex(e => e.DocumentType);
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.EmployeeId);

                entity.OwnsOne(e => e.UserContext);
            });
        }
    }

    public class LeaveRepository : PostgresDbRepository<Leave>, ILeaveRepository
    {
        public LeaveRepository(
            PostgresDbContext context,
            ILogger<LeaveRepository> logger,
            ITelemetryService telemetryService,
            IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor)
        {
        }

        public override string TableName { get; } = nameof(Leave);

        public override string GenerateId(Leave entity)
            => Guid.NewGuid().ToString();

        public Expression<Func<Leave, bool>> GetAllLeavesQuery(GetAllLeavesRequest request)
        {
            Expression<Func<Leave, bool>> filter =
                x => x.DocumentType == nameof(Leave);

            if (request.RequestParam == null)
                return filter;

            var LeaveRequest = request.RequestParam;

            if (!string.IsNullOrEmpty(LeaveRequest.LeaveId))
                filter = filter.And(x => x.Id == LeaveRequest.LeaveId);

            if (!string.IsNullOrEmpty(LeaveRequest.UserId))
                filter = filter.And(x => x.UserId == LeaveRequest.UserId);

            if (!string.IsNullOrEmpty(LeaveRequest.EmployeeId))
                filter = filter.And(x => x.EmployeeId == LeaveRequest.EmployeeId);

            return filter;
        }

        public async Task<(IEnumerable<Leave> result, int count)>
            GetAllLeavesWithCountAsync(GetAllLeavesRequest request)
        {
            var orderBy =
                request.OrderByCriteria != null
                    ? OrderBy(request)
                    : x => x.ModifiedOn;

            return await GetItemsWithCountAsync(
                GetAllLeavesQuery(request),
                request,
                orderBy);
        }

        public async Task<Leave?> GetLeaveAsync(GetAllLeavesRequest request)
        {
            return await GetItemAsync(GetAllLeavesQuery(request));
        }
    }

}
