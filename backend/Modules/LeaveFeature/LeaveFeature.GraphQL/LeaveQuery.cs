using HRMS.Shared.Application.DTOs;
using HRMS.Shared.Application.GraphQL;
using HotChocolate;
using HotChocolate.Types;
using MediatR;
using LeaveFeature.Application.DTO;

namespace LeaveFeature.GraphQL
{
    [ExtendObjectType(typeof(Query))]
    public class LeaveQuery
    {
        [GraphQLName("getAllLeaves")]
        public async Task<BaseResponsePagination<GetAllLeavesResponse>>
        GetAllLeavesAsync(
        GetAllLeavesRequest request,
        [Service] IMediator mediator)
        {
            return await mediator.Send(request);
        }
    }
}
