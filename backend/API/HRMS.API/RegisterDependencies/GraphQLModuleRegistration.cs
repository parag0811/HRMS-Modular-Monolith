using HotChocolate.Execution.Configuration;
using TodoFeature.GraphQL;
using AttendanceFeature.GraphQL;
using LeaveFeature.GraphQL;
using EmployeeFeature.GraphQL;

namespace HRMS.API.RegisterDependencies
{
    public static class GraphQLModuleRegistration
    {
        public static IRequestExecutorBuilder AddGraphQLModules(this IRequestExecutorBuilder builder)
        {
            return builder
                .AddTodosGraphQL()
                .AddAttendanceGraphQL()
                .AddLeaveGraphQL()
                .AddEmployeeGraphQL();
        }
    }
}
