export type Priority = 'low' | 'medium' | 'high';

export type Status = 'todo' | 'inProgress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  assignee: string;
  priority: Priority;
  status: Status;
  createdAt: string;
}

export interface Column {
  id: Status;
  title: string;
  taskIds: string[];
}

export interface BoardData {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: Status[];
}