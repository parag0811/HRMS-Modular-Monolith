import { gql } from "@apollo/client";

export const GET_ALL_LEAVES = gql`
  query getAllLeaves($request: GetAllLeavesRequestInput!) {
    getAllLeaves(request: $request) {
      success
      message
      statusCode
      data {
        leaves {
          leaveId
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
