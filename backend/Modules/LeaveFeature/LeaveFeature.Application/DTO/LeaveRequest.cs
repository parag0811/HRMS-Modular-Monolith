using HRMS.Core.Postgres.Common;
using HRMS.Shared.Application.DTOs;
using MediatR;

namespace LeaveFeature.Application.DTO
{
    public interface ILeaveIdDto
    {
        string? LeaveId { get; set; }
    }

    public interface ILeavePayloadDto
    {
        string? EmployeeId { get; set; }
        DateTime ClockIn { get; set; }
        DateTime? ClockOut { get; set; }
        string? Status { get; set; }
        string? UserId { get; set; }
    }

    public class CreateLeaveDto : ILeavePayloadDto
    {
        public string? EmployeeId { get; set; }
        public DateTime ClockIn { get; set; }
        public DateTime? ClockOut { get; set; }
        public string? Status { get; set; }
        public string? UserId { get; set; }
    }

    public class CreateLeaveRequest : ExecutionRequest, IRequest<BaseResponse<CreateLeaveResponse>>
    {
        public CreateLeaveDto? RequestParam { get; set; }
    }

    public class UpdateLeaveDto : ILeaveIdDto, ILeavePayloadDto
    {
        public string? LeaveId { get; set; }
        public string? EmployeeId { get; set; }
        public DateTime ClockIn { get; set; }
        public DateTime? ClockOut { get; set; }
        public string? Status { get; set; }
        public string? UserId { get; set; }
    }

    public class UpdateLeaveRequest : ExecutionRequest, IRequest<BaseResponse<UpdateLeaveResponse>>
    {
        public UpdateLeaveDto? RequestParam { get; set; }
    }

    public class DeleteLeaveDto : ILeaveIdDto
    {
        public string? LeaveId { get; set; }
    }

    public class DeleteLeaveRequest : ExecutionRequest, IRequest<BaseResponse<DeleteLeaveResponse>>
    {
        public DeleteLeaveDto? RequestParam { get; set; }
    }

    public class GetAllLeavesDto
    {
        public string? LeaveId { get; set; }
        public string? EmployeeId { get; set; }
        public string? Status { get; set; }
        public string? UserId { get; set; }
    }

    public class GetAllLeavesRequest : Request, IRequest<BaseResponsePagination<GetAllLeavesResponse>>
    {
        public GetAllLeavesDto? RequestParam { get; set; }
    }
}