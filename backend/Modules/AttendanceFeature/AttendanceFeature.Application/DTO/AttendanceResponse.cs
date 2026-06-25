using HRMS.Shared.Application.DTOs;

namespace AttendanceFeature.Application.DTO
{
    public class CreateAttendanceResponse
    {
        public string? AttendanceId { get; set; }
    }

    public class UpdateAttendanceResponse
    {
        public string? AttendanceId { get; set; }
    }

    public class DeleteAttendanceResponse
    {
        public string? AttendanceId { get; set; }
    }

    public class GetAllAttendancesItem
    {
        public string? AttendanceId { get; set; }
        public string? EmployeeId { get; set; }

        public DateTime ClockIn { get; set; }

        public DateTime? ClockOut { get; set; }

        public string? Status { get; set; }

        public UserBaseItem? UserContext { get; set; }

        public string? UserId { get; set; }
    }

    public class GetAllAttendancesResponse
    {
        public List<GetAllAttendancesItem>? Attendances { get; set; }
    }
}