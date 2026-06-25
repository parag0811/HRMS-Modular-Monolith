using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EmployeeFeature.GraphQL
{
    public static class EmployeeGraphQLExtensions
    {
        public static IRequestExecutorBuilder AddEmployeeGraphQL(this IRequestExecutorBuilder builder)
        {
            return builder
                .AddTypeExtension<EmployeeMutation>()
                .AddTypeExtension<EmployeeQuery>();
        }
    }
}
