using TodoFeature.Infrastructure;
using AttendanceFeature.Infrastructure;
using LeaveFeature.Infrastructure;
using EmployeeFeature.Infrastructure;

namespace HRMS.API.RegisterDependencies
{
    public static class RepositoryRegistration
    {
        public static IServiceCollection AddModulesDependencyInjection(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddTodoDependency(configuration);
            services.AddAttendanceDependency(configuration);
            services.AddLeaveDependency(configuration);
            services.AddEmployeeDependency(configuration);

            return services;
        }
    }
}