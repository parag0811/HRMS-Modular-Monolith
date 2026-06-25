using HRMS.Core.Postgres.Helper;
using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Interfaces;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;
using AttendanceFeature.Application.DTO;
using AttendanceFeature.Application.Repository;
using AttendanceFeature.Domain;

namespace AttendanceFeature.Infrastructure
{
    public class AttendanceEntityConfigurator : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Attendance>(entity =>
            {
                entity.ToTable("Attendance");
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

    public class AttendanceRepository : PostgresDbRepository<Attendance>, IAttendanceRepository
    {
        public AttendanceRepository(
            PostgresDbContext context,
            ILogger<AttendanceRepository> logger,
            ITelemetryService telemetryService,
            IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor)
        {
        }

        public override string TableName { get; } = nameof(Attendance);

        public override string GenerateId(Attendance entity)
            => Guid.NewGuid().ToString();

        public Expression<Func<Attendance, bool>> GetAllAttendancesQuery(GetAllAttendancesRequest request)
        {
            Expression<Func<Attendance, bool>> filter =
                x => x.DocumentType == nameof(Attendance);

            if (request.RequestParam == null)
                return filter;

            var attendanceRequest = request.RequestParam;

            if (!string.IsNullOrEmpty(attendanceRequest.AttendanceId))
                filter = filter.And(x => x.Id == attendanceRequest.AttendanceId);

            if (!string.IsNullOrEmpty(attendanceRequest.UserId))
                filter = filter.And(x => x.UserId == attendanceRequest.UserId);

            if (!string.IsNullOrEmpty(attendanceRequest.EmployeeId))
                filter = filter.And(x => x.EmployeeId == attendanceRequest.EmployeeId);

            return filter;
        }

        public async Task<(IEnumerable<Attendance> result, int count)>
            GetAllAttendancesWithCountAsync(GetAllAttendancesRequest request)
        {
            var orderBy =
                request.OrderByCriteria != null
                    ? OrderBy(request)
                    : x => x.ModifiedOn;

            return await GetItemsWithCountAsync(
                GetAllAttendancesQuery(request),
                request,
                orderBy);
        }

        public async Task<Attendance?> GetAttendanceAsync(GetAllAttendancesRequest request)
        {
            return await GetItemAsync(GetAllAttendancesQuery(request));
        }
    }

}
