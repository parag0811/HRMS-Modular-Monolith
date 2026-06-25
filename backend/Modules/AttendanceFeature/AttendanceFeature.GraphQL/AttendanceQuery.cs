using HRMS.Shared.Application.DTOs;
using HRMS.Shared.Application.GraphQL;
using HotChocolate;
using HotChocolate.Types;
using MediatR;
using AttendanceFeature.Application.DTO;

namespace AttendanceFeature.GraphQL
{
    [ExtendObjectType(typeof(Query))]
    public class AttendanceQuery
    {
        [GraphQLName("getAllAttendances")]
        public async Task<BaseResponsePagination<GetAllAttendancesResponse>>
        GetAllAttendancesAsync(
        GetAllAttendancesRequest request,
        [Service] IMediator mediator)
        {
            return await mediator.Send(request);
        }
    }
}
