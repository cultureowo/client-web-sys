export interface ApiTodo {
  id: number | string;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface TodosResponse {
  todos: ApiTodo[];
  total: number;
  skip: number;
  limit: number;
}

export type RequestStatus = "loading" | "success" | "error";
