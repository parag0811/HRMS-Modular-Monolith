import { gql } from "@apollo/client";

export const CREATE_TODO = gql`
  mutation createTodo($request: CreateTodoRequestInput!) {
    createTodo(request: $request) {
      success
      message
      statusCode
      data {
        todoId
      }
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation updateTodo($request: UpdateTodoRequestInput!) {
    updateTodo(request: $request) {
      success
      message
      statusCode
      data {
        todoId
      }
    }
  }
`;

export const DELETE_TODO = gql`
  mutation deleteTodo($request: DeleteTodoRequestInput!) {
    deleteTodo(request: $request) {
      success
      message
      statusCode
      data {
        todoId
      }
    }
  }
`;
