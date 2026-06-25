using HRMS.Core.Postgres.Common;
using HRMS.Shared.Domain.Entity;

namespace EmployeeFeature.Domain
{
    public class Employee : BaseEntity
    {
        public string? EmployeeCode { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? DepartmentId { get; set; }
        public string? RoleId { get; set; }
        public string? ManagerId { get; set; }
        public DateTime? DateOfJoining { get; set; }
        public string Status { get; set; } = "Active";

        public UserBase? UserContext { get; set; }
        public string? UserId { get; set; }
    }
}
