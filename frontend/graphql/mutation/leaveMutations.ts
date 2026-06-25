import { gql } from "@apollo/client";

export const CREATE_LEAVE = gql`
  mutation createLeave($request: CreateLeaveRequestInput!) {
    createLeave(request: $request) {
      success
      message
      statusCode
      data {
        leaveId
      }
    }
  }
`;

export const UPDATE_LEAVE = gql`
  mutation updateLeave($request: UpdateLeaveRequestInput!) {
    updateLeave(request: $request) {
      success
      message
      statusCode
      data {
        leaveId
      }
    }
  }
`;

export const DELETE_LEAVE = gql`
  mutation deleteLeave($request: DeleteLeaveRequestInput!) {
    deleteLeave(request: $request) {
      success
      message
      statusCode
      data {
        leaveId
      }
    }
  }
`;
