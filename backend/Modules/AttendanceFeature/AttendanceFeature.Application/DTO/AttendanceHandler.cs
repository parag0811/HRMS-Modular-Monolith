using AutoMapper;
using HRMS.Core.Telemetry.Exceptions;
using HRMS.Shared.Application.Constants;
using HRMS.Shared.Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;
using AttendanceFeature.Application.Repository;
using AttendanceFeature.Domain;

namespace AttendanceFeature.Application.DTO
{
    public class CreateAttendanceHandler : IRequestHandler<CreateAttendanceRequest, BaseResponse<CreateAttendanceResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IAttendanceRepository _attendanceRepository;

    public CreateAttendanceHandler(IMapper mapper, IAttendanceRepository attendanceRepository)
        {
            _mapper = mapper;
            _attendanceRepository = attendanceRepository;
        }

        public async Task<BaseResponse<CreateAttendanceResponse>> Handle(CreateAttendanceRequest request, CancellationToken cancellationToken)
        {
            if (request?.RequestParam == null)
                throw new BadRequestException(string.Format(Messaging.InvalidRequest));

            var response = new BaseResponse<CreateAttendanceResponse>();

            var attendance = _mapper.Map<Attendance>(request.RequestParam);

            attendance = await _attendanceRepository.AddItemAsync(attendance);

            if (attendance != null)
            {
                response.Data = new CreateAttendanceResponse
                {
                    AttendanceId = attendance.Id
                };

                response.StatusCode = StatusCodes.Status200OK;
                response.Message = string.Format(Messaging.Insert, nameof(Attendance));
                response.Success = true;
            }

            return response;
        }
    }

    public sealed class GetAllAttendancesHandler : IRequestHandler<GetAllAttendancesRequest, BaseResponsePagination<GetAllAttendancesResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IAttendanceRepository _attendanceRepository;

        public GetAllAttendancesHandler(IAttendanceRepository attendanceRepository, IMapper mapper)
        {
            _mapper = mapper;
            _attendanceRepository = attendanceRepository;
        }

        public async Task<BaseResponsePagination<GetAllAttendancesResponse>> Handle(GetAllAttendancesRequest request, CancellationToken cancellationToken)
        {
            if (request == null)
                throw new BadRequestException(string.Format(Messaging.InvalidRequest));

            var response = new BaseResponsePagination<GetAllAttendancesResponse>();

            (var attendances, int count) =
                await _attendanceRepository.GetAllAttendancesWithCountAsync(request);

            if (attendances != null && attendances.Any())
            {
                var data = _mapper.Map<IReadOnlyList<Attendance>, IReadOnlyList<GetAllAttendancesItem>>(attendances.ToList());

                response.Data = new GetAllAttendancesResponse
                {
                    Attendances = data.ToList()
                };

                if (request.PageCriteria != null && request.PageCriteria.EnablePage)
                {
                    response.Meta = new Meta
                    {
                        Skip = request.PageCriteria.Skip,
                        Take = request.PageCriteria.PageSize,
                        TotalCount = count
                    };
                }
            }

            response.Success = true;
            response.StatusCode = StatusCodes.Status200OK;

            return response;
        }
    }

    public sealed class UpdateAttendanceHandler : IRequestHandler<UpdateAttendanceRequest, BaseResponse<UpdateAttendanceResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IAttendanceRepository _attendanceRepository;

        public UpdateAttendanceHandler(IMapper mapper, IAttendanceRepository attendanceRepository)
        {
            _mapper = mapper;
            _attendanceRepository = attendanceRepository;
        }

        public async Task<BaseResponse<UpdateAttendanceResponse>> Handle(UpdateAttendanceRequest request, CancellationToken cancellationToken)
        {
            if (request?.RequestParam == null)
                throw new BadRequestException(string.Format(Messaging.InvalidRequest));

            var existing = await _attendanceRepository.GetAttendanceAsync(
                new GetAllAttendancesRequest
                {
                    RequestParam = new GetAllAttendancesDto
                    {
                        AttendanceId = request.RequestParam.AttendanceId
                    }
                });

            if (existing == null)
                throw new NotFoundException(string.Format(Messaging.NotFound, nameof(Attendance)));

            var attendance = _mapper.Map<Attendance>(request.RequestParam);

            attendance.UserContext = existing.UserContext;
            attendance.CreatedOn = existing.CreatedOn;
            attendance.CreatedByUserId = existing.CreatedByUserId;
            attendance.CreatedByUserName = existing.CreatedByUserName;

            await _attendanceRepository.UpdateItemAsync(existing.Id, attendance);

            return new BaseResponse<UpdateAttendanceResponse>
            {
                Data = new UpdateAttendanceResponse
                {
                    AttendanceId = existing.Id
                },
                StatusCode = StatusCodes.Status200OK,
                Message = string.Format(Messaging.Update, nameof(Attendance)),
                Success = true
            };
        }
    }

    public sealed class DeleteAttendanceHandler : IRequestHandler<DeleteAttendanceRequest, BaseResponse<DeleteAttendanceResponse>>
    {
        private readonly IAttendanceRepository _attendanceRepository;

        public DeleteAttendanceHandler(IAttendanceRepository attendanceRepository)
        {
            _attendanceRepository = attendanceRepository;
        }

        public async Task<BaseResponse<DeleteAttendanceResponse>> Handle(DeleteAttendanceRequest request, CancellationToken cancellationToken)
        {
            if (request?.RequestParam == null)
                throw new BadRequestException(string.Format(Messaging.InvalidRequest));

            var existing = await _attendanceRepository.GetAttendanceAsync(
                new GetAllAttendancesRequest
                {
                    RequestParam = new GetAllAttendancesDto
                    {
                        AttendanceId = request.RequestParam.AttendanceId
                    }
                });

            if (existing == null)
                throw new NotFoundException(string.Format(Messaging.NotFound, nameof(Attendance)));

            await _attendanceRepository.DeleteItemAsync(existing.Id);

            return new BaseResponse<DeleteAttendanceResponse>
            {
                Data = new DeleteAttendanceResponse
                {
                    AttendanceId = existing.Id
                },
                StatusCode = StatusCodes.Status200OK,
                Message = string.Format(Messaging.Delete, nameof(Attendance)),
                Success = true
            };
        }
    }


}
