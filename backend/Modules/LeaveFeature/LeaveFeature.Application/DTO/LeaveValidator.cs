using FluentValidation;
using HRMS.Shared.Application.Constants;
using HRMS.Shared.Application.Extensions;

namespace LeaveFeature.Application.DTO
{
    public class CreateLeaveValidator : AbstractValidator<CreateLeaveRequest>
    {
        public CreateLeaveValidator()
        {
            this.ValidateRequiredRequestParam(
            x => x.RequestParam!,
            new LeavePayloadValidator<CreateLeaveDto>());
        }
    }

    public class UpdateLeaveValidator : AbstractValidator<UpdateLeaveRequest>
    {
        public UpdateLeaveValidator()
        {
            this.ValidateRequiredRequestParam(
                x => x.RequestParam!,
                new LeaveUpdatePayloadValidator());
        }
    }

    public class DeleteLeaveValidator : AbstractValidator<DeleteLeaveRequest>
    {
        public DeleteLeaveValidator()
        {
            this.ValidateRequiredRequestParam(
                x => x.RequestParam!,
                new LeaveIdValidator<DeleteLeaveDto>());
        }
    }

    internal class LeavePayloadValidator<TLeaveDto> : AbstractValidator<TLeaveDto>
        where TLeaveDto : ILeavePayloadDto
    {
        public LeavePayloadValidator()
        {
            RuleFor(x => x.EmployeeId)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(CreateLeaveDto.EmployeeId)));
        }
    }

    internal class LeaveUpdatePayloadValidator : AbstractValidator<UpdateLeaveDto>
    {
        public LeaveUpdatePayloadValidator()
        {
            RuleFor(x => x.LeaveId)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdateLeaveDto.LeaveId)));

            RuleFor(x => x.EmployeeId)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdateLeaveDto.EmployeeId)));
        }
    }

    internal class LeaveIdValidator<TLeaveDto> : AbstractValidator<TLeaveDto>
        where TLeaveDto : ILeaveIdDto
    {
        public LeaveIdValidator()
        {
            RuleFor(x => x.LeaveId)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(ILeaveIdDto.LeaveId)));
        }
    }

}
