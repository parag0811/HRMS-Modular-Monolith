using HRMS.Core.Postgres.Common;
using HRMS.Shared.Application.DTOs;
using MediatR;

namespace EmployeeFeature.Application.DTO
{
    public interface IEmployeeIdDto
    {
        string? EmployeeId { get; set; }
    }

    public interface IEmployeePayloadDto
    {
        string? EmployeeCode { get; set; }
        string? FirstName { get; set; }
        string? LastName { get; set; }
        string? Email { get; set; }
        string? Phone { get; set; }
        string? DepartmentId { get; set; }
        string? RoleId { get; set; }
        string? ManagerId { get; set; }
        DateTime? DateOfJoining { get; set; }
        string? Status { get; set; }
        string? UserId { get; set; }
    }

    public class CreateEmployeeDto : IEmployeePayloadDto
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
        public string? Status { get; set; }
        public string? UserId { get; set; }
    }

    public class CreateEmployeeRequest : ExecutionRequest, IRequest<BaseResponse<CreateEmployeeResponse>>
    {
        public CreateEmployeeDto? RequestParam { get; set; }
    }

    public class UpdateEmployeeDto : IEmployeeIdDto, IEmployeePayloadDto
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
        public string? UserId { get; set; }
    }

    public class UpdateEmployeeRequest : ExecutionRequest, IRequest<BaseResponse<UpdateEmployeeResponse>>
    {
        public UpdateEmployeeDto? RequestParam { get; set; }
    }

    public class DeleteEmployeeDto : IEmployeeIdDto
    {
        public string? EmployeeId { get; set; }
    }

    public class DeleteEmployeeRequest : ExecutionRequest, IRequest<BaseResponse<DeleteEmployeeResponse>>
    {
        public DeleteEmployeeDto? RequestParam { get; set; }
    }

    public class GetAllEmployeesDto
    {
        public string? EmployeeId { get; set; }
        public string? EmployeeCode { get; set; }
        public string? DepartmentId { get; set; }
        public string? RoleId { get; set; }
        public string? Status { get; set; }
        public string? UserId { get; set; }
    }

    public class GetAllEmployeesRequest : Request, IRequest<BaseResponsePagination<GetAllEmployeesResponse>>
    {
        public GetAllEmployeesDto? RequestParam { get; set; }
    }
}
