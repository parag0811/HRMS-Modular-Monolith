using HRMS.Core.Postgres.Common;
using HRMS.Shared.Domain.Entity;

namespace AttendanceFeature.Domain
{
    public class Attendance : BaseEntity
    {
        public string? EmployeeId { get; set; }

        public DateTime ClockIn { get; set; }

        public DateTime? ClockOut { get; set; }

        public string Status { get; set; } = "Present";
        public UserBase? UserContext { get; set; }
        public string? UserId { get; set; }
    }
}
