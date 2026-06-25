using FluentValidation;
using HRMS.Shared.Application.Constants;
using HRMS.Shared.Application.Extensions;

namespace AttendanceFeature.Application.DTO
{
    public class CreateAttendanceValidator : AbstractValidator<CreateAttendanceRequest>
    {
        public CreateAttendanceValidator()
        {
            this.ValidateRequiredRequestParam(
            x => x.RequestParam!,
            new AttendancePayloadValidator<CreateAttendanceDto>());
        }
    }

    public class UpdateAttendanceValidator : AbstractValidator<UpdateAttendanceRequest>
    {
        public UpdateAttendanceValidator()
        {
            this.ValidateRequiredRequestParam(
                x => x.RequestParam!,
                new AttendanceUpdatePayloadValidator());
        }
    }

    public class DeleteAttendanceValidator : AbstractValidator<DeleteAttendanceRequest>
    {
        public DeleteAttendanceValidator()
        {
            this.ValidateRequiredRequestParam(
                x => x.RequestParam!,
                new AttendanceIdValidator<DeleteAttendanceDto>());
        }
    }

    internal class AttendancePayloadValidator<TAttendanceDto> : AbstractValidator<TAttendanceDto>
        where TAttendanceDto : IAttendancePayloadDto
    {
        public AttendancePayloadValidator()
        {
            RuleFor(x => x.EmployeeId)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(CreateAttendanceDto.EmployeeId)));
        }
    }

    internal class AttendanceUpdatePayloadValidator : AbstractValidator<UpdateAttendanceDto>
    {
        public AttendanceUpdatePayloadValidator()
        {
            RuleFor(x => x.AttendanceId)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdateAttendanceDto.AttendanceId)));

            RuleFor(x => x.EmployeeId)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdateAttendanceDto.EmployeeId)));
        }
    }

    internal class AttendanceIdValidator<TAttendanceDto> : AbstractValidator<TAttendanceDto>
        where TAttendanceDto : IAttendanceIdDto
    {
        public AttendanceIdValidator()
        {
            RuleFor(x => x.AttendanceId)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(IAttendanceIdDto.AttendanceId)));
        }
    }

}
