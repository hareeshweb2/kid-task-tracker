export interface SubTask {
  name: string;
  done: boolean;
}

export interface Task {
  name: string;
  done: boolean;
  subtasks?: SubTask[];
}
