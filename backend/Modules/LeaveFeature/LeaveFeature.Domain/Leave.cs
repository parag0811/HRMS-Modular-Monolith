using HRMS.Core.Postgres.Common;
using HRMS.Shared.Domain.Entity;

namespace LeaveFeature.Domain
{
    public class Leave : BaseEntity
    {
        public string? EmployeeId { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string? Reason { get; set; }

        public string Status { get; set; } = "Pending";

        public UserBase? UserContext { get; set; }

        public string? UserId { get; set; }
    }
}