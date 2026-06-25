import { gql } from "@apollo/client";

export const CREATE_EMPLOYEE = gql`
  mutation createEmployee($request: CreateEmployeeRequestInput!) {
    createEmployee(request: $request) {
      success
      message
      statusCode
      data {
        employeeId
      }
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation updateEmployee($request: UpdateEmployeeRequestInput!) {
    updateEmployee(request: $request) {
      success
      message
      statusCode
      data {
        employeeId
      }
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation deleteEmployee($request: DeleteEmployeeRequestInput!) {
    deleteEmployee(request: $request) {
      success
      message
      statusCode
      data {
        employeeId
      }
    }
  }
`;
