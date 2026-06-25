import { gql } from "@apollo/client";

export const GET_ALL_TODOS = gql`
  query getAllTodos($request: GetAllTodosRequestInput!) {
    getAllTodos(request: $request) {
      success
      message
      statusCode
      data {
        todos {
          todoId
          title
          description
          dueDate
          isCompleted
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
