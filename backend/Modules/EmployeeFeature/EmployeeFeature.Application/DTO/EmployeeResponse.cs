using HRMS.Shared.Application.DTOs;

namespace EmployeeFeature.Application.DTO
{
    public class CreateEmployeeResponse
    {
        public string? EmployeeId { get; set; }
    }

    public class UpdateEmployeeResponse
    {
        public string? EmployeeId { get; set; }
    }

    public class DeleteEmployeeResponse
    {
        public string? EmployeeId { get; set; }
    }

    public class GetAllEmployeesItem
    {
        public string? EmployeeId { get; set; }
        public string? EmployeeCode { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? DepartmentId { get; set; }
        public string? RoleId { get; set; }
        public string? ManagerId { get; set; }
        public DateTime? DateOfJoining { get; set; }
        public string? Status { get; set; }

        public UserBaseItem? UserContext { get; set; }
        public string? UserId { get; set; }
    }

    public class GetAllEmployeesResponse
    {
        public List<GetAllEmployeesItem>? Employees { get; set; }
    }
}
