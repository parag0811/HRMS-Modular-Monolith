import { gql } from "@apollo/client";

export const CREATE_ATTENDANCE = gql`
  mutation createAttendance($request: CreateAttendanceRequestInput!) {
    createAttendance(request: $request) {
      success
      message
      statusCode
      data {
        attendanceId
      }
    }
  }
`;

export const UPDATE_ATTENDANCE = gql`
  mutation updateAttendance($request: UpdateAttendanceRequestInput!) {
    updateAttendance(request: $request) {
      success
      message
      statusCode
      data {
        attendanceId
      }
    }
  }
`;

export const DELETE_ATTENDANCE = gql`
  mutation deleteAttendance($request: DeleteAttendanceRequestInput!) {
    deleteAttendance(request: $request) {
      success
      message
      statusCode
      data {
        attendanceId
      }
    }
  }
`;
