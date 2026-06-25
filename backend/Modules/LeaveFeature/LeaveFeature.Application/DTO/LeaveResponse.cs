using HRMS.Shared.Application.DTOs;

namespace LeaveFeature.Application.DTO
{
    public class CreateLeaveResponse
    {
        public string? LeaveId { get; set; }
    }

    public class UpdateLeaveResponse
    {
        public string? LeaveId { get; set; }
    }

    public class DeleteLeaveResponse
    {
        public string? LeaveId { get; set; }
    }

    public class GetAllLeavesItem
    {
        public string? LeaveId { get; set; }
        public string? EmployeeId { get; set; }

        public DateTime ClockIn { get; set; }

        public DateTime? ClockOut { get; set; }

        public string? Status { get; set; }

        public UserBaseItem? UserContext { get; set; }

        public string? UserId { get; set; }
    }

    public class GetAllLeavesResponse
    {
        public List<GetAllLeavesItem>? Leaves { get; set; }
    }
}