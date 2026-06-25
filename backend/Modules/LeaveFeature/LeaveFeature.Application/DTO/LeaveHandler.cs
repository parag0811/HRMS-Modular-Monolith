using AutoMapper;
using HRMS.Core.Telemetry.Exceptions;
using HRMS.Shared.Application.Constants;
using HRMS.Shared.Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;
using LeaveFeature.Application.Repository;
using LeaveFeature.Domain;

namespace LeaveFeature.Application.DTO
{
    public class CreateLeaveHandler : IRequestHandler<CreateLeaveRequest, BaseResponse<CreateLeaveResponse>>
    {
        private readonly IMapper _mapper;
        private readonly ILeaveRepository _leaveRepository;

        public CreateLeaveHandler(IMapper mapper, ILeaveRepository leaveRepository)
        {
            _mapper = mapper;
            _leaveRepository = leaveRepository;
        }

        public async Task<BaseResponse<CreateLeaveResponse>> Handle(CreateLeaveRequest request, CancellationToken cancellationToken)
        {
            if (request?.RequestParam == null)
                throw new BadRequestException(string.Format(Messaging.InvalidRequest));

            var response = new BaseResponse<CreateLeaveResponse>();

            var leaveEntity = _mapper.Map<Leave>(request.RequestParam);

            leaveEntity = await _leaveRepository.AddItemAsync(leaveEntity);

            if (leaveEntity != null)
            {
                response.Data = new CreateLeaveResponse
                {
                    LeaveId = leaveEntity.Id
                };

                response.StatusCode = StatusCodes.Status200OK;
                response.Message = string.Format(Messaging.Insert, nameof(Leave));
                response.Success = true;
            }

            return response;
        }
    }

    public sealed class GetAllLeavesHandler : IRequestHandler<GetAllLeavesRequest, BaseResponsePagination<GetAllLeavesResponse>>
    {
        private readonly IMapper _mapper;
        private readonly ILeaveRepository _leaveRepository;

        public GetAllLeavesHandler(ILeaveRepository leaveRepository, IMapper mapper)
        {
            _mapper = mapper;
            _leaveRepository = leaveRepository;
        }

        public async Task<BaseResponsePagination<GetAllLeavesResponse>> Handle(GetAllLeavesRequest request, CancellationToken cancellationToken)
        {
            if (request == null)
                throw new BadRequestException(string.Format(Messaging.InvalidRequest));

            var response = new BaseResponsePagination<GetAllLeavesResponse>();

            (var leaves, int count) = await _leaveRepository.GetAllLeavesWithCountAsync(request);

            if (leaves != null && leaves.Any())
            {
                var data = _mapper.Map<IReadOnlyList<Leave>, IReadOnlyList<GetAllLeavesItem>>(leaves.ToList());

                response.Data = new GetAllLeavesResponse
                {
                    Leaves = data.ToList()
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

    public sealed class UpdateLeaveHandler : IRequestHandler<UpdateLeaveRequest, BaseResponse<UpdateLeaveResponse>>
    {
        private readonly IMapper _mapper;
        private readonly ILeaveRepository _leaveRepository;

        public UpdateLeaveHandler(IMapper mapper, ILeaveRepository leaveRepository)
        {
            _mapper = mapper;
            _leaveRepository = leaveRepository;
        }

        public async Task<BaseResponse<UpdateLeaveResponse>> Handle(UpdateLeaveRequest request, CancellationToken cancellationToken)
        {
            if (request?.RequestParam == null)
                throw new BadRequestException(string.Format(Messaging.InvalidRequest));

            var existing = await _leaveRepository.GetLeaveAsync(
                new GetAllLeavesRequest
                {
                    RequestParam = new GetAllLeavesDto
                    {
                        LeaveId = request.RequestParam.LeaveId
                    }
                });

            if (existing == null)
                throw new NotFoundException(string.Format(Messaging.NotFound, nameof(Leave)));

            var leaveEntity = _mapper.Map<Leave>(request.RequestParam);

            leaveEntity.UserContext = existing.UserContext;
            leaveEntity.CreatedOn = existing.CreatedOn;
            leaveEntity.CreatedByUserId = existing.CreatedByUserId;
            leaveEntity.CreatedByUserName = existing.CreatedByUserName;

            await _leaveRepository.UpdateItemAsync(existing.Id, leaveEntity);

            return new BaseResponse<UpdateLeaveResponse>
            {
                Data = new UpdateLeaveResponse
                {
                    LeaveId = existing.Id
                },
                StatusCode = StatusCodes.Status200OK,
                Message = string.Format(Messaging.Update, nameof(Leave)),
                Success = true
            };
        }
    }

    public sealed class DeleteLeaveHandler : IRequestHandler<DeleteLeaveRequest, BaseResponse<DeleteLeaveResponse>>
    {
        private readonly ILeaveRepository _leaveRepository;

        public DeleteLeaveHandler(ILeaveRepository leaveRepository)
        {
            _leaveRepository = leaveRepository;
        }

        public async Task<BaseResponse<DeleteLeaveResponse>> Handle(DeleteLeaveRequest request, CancellationToken cancellationToken)
        {
            if (request?.RequestParam == null)
                throw new BadRequestException(string.Format(Messaging.InvalidRequest));

            var existing = await _leaveRepository.GetLeaveAsync(
                new GetAllLeavesRequest
                {
                    RequestParam = new GetAllLeavesDto
                    {
                        LeaveId = request.RequestParam.LeaveId
                    }
                });

            if (existing == null)
                throw new NotFoundException(string.Format(Messaging.NotFound, nameof(Leave)));

            await _leaveRepository.DeleteItemAsync(existing.Id);

            return new BaseResponse<DeleteLeaveResponse>
            {
                Data = new DeleteLeaveResponse
                {
                    LeaveId = existing.Id
                },
                StatusCode = StatusCodes.Status200OK,
                Message = string.Format(Messaging.Delete, nameof(Leave)),
                Success = true
            };
        }
    }
}