import { gql } from "@apollo/client";

export const GET_ALL_EMPLOYEES = gql`
  query getAllEmployees($request: GetAllEmployeesRequestInput!) {
    getAllEmployees(request: $request) {
      success
      message
      statusCode
      data {
        employees {
          employeeId
          employeeCode
          firstName
          lastName
          email
          phone
          departmentId
          roleId
          managerId
          dateOfJoining
          status
          userId
        }
      }
    }
  }
`;
