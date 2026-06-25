using HRMS.Core.Postgres.Common;
using HRMS.Shared.Application.DTOs;
using MediatR;

namespace AttendanceFeature.Application.DTO
{
    public interface IAttendanceIdDto
    {
        string? AttendanceId { get; set; }
    }

    public interface IAttendancePayloadDto
    {
        string? EmployeeId { get; set; }
        DateTime ClockIn { get; set; }
        DateTime? ClockOut { get; set; }
        string? Status { get; set; }
        string? UserId { get; set; }
    }

    public class CreateAttendanceDto : IAttendancePayloadDto
    {
        public string? EmployeeId { get; set; }
        public DateTime ClockIn { get; set; }
        public DateTime? ClockOut { get; set; }
        public string? Status { get; set; }
        public string? UserId { get; set; }
    }

    public class CreateAttendanceRequest : ExecutionRequest, IRequest<BaseResponse<CreateAttendanceResponse>>
    {
        public CreateAttendanceDto? RequestParam { get; set; }
    }

    public class UpdateAttendanceDto : IAttendanceIdDto, IAttendancePayloadDto
    {
        public string? AttendanceId { get; set; }
        public string? EmployeeId { get; set; }
        public DateTime ClockIn { get; set; }
        public DateTime? ClockOut { get; set; }
        public string? Status { get; set; }
        public string? UserId { get; set; }
    }

    public class UpdateAttendanceRequest : ExecutionRequest, IRequest<BaseResponse<UpdateAttendanceResponse>>
    {
        public UpdateAttendanceDto? RequestParam { get; set; }
    }

    public class DeleteAttendanceDto : IAttendanceIdDto
    {
        public string? AttendanceId { get; set; }
    }

    public class DeleteAttendanceRequest : ExecutionRequest, IRequest<BaseResponse<DeleteAttendanceResponse>>
    {
        public DeleteAttendanceDto? RequestParam { get; set; }
    }

    public class GetAllAttendancesDto
    {
        public string? AttendanceId { get; set; }
        public string? EmployeeId { get; set; }
        public string? Status { get; set; }
        public string? UserId { get; set; }
    }

    public class GetAllAttendancesRequest : Request, IRequest<BaseResponsePagination<GetAllAttendancesResponse>>
    {
        public GetAllAttendancesDto? RequestParam { get; set; }
    }
}