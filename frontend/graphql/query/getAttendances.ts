import { gql } from "@apollo/client";

export const GET_ALL_ATTENDANCES = gql`
  query getAllAttendances($request: GetAllAttendancesRequestInput!) {
    getAllAttendances(request: $request) {
      success
      message
      statusCode
      data {
        attendances {
          attendanceId
          employeeId
          clockIn
          clockOut
          status
          userId
        }
      }
      meta {
        skip
        take
        totalCount
        totalPages
        pageNumber
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;
