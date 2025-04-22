import { BoardData } from '../types';

export const initialData: BoardData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Create project requirements',
      description: 'Outline the main features and scope of the project',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      assignee: 'Sarah Chen',
      priority: 'high',
      status: 'todo',
      createdAt: new Date().toISOString(),
    },
    'task-2': {
      id: 'task-2',
      title: 'Design UI mockups',
      description: 'Create visual designs for the main screens',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      assignee: 'Miguel Alvarez',
      priority: 'medium',
      status: 'todo',
      createdAt: new Date().toISOString(),
    },
    'task-3': {
      id: 'task-3',
      title: 'Set up project repository',
      description: 'Initialize Git repository and configure CI/CD pipeline',
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      assignee: 'Alex Johnson',
      priority: 'low',
      status: 'inProgress',
      createdAt: new Date().toISOString(),
    },
    'task-4': {
      id: 'task-4',
      title: 'Implement authentication',
      description: 'Add user login and registration functionality',
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      assignee: 'Li Wei',
      priority: 'high',
      status: 'inProgress',
      createdAt: new Date().toISOString(),
    },
    'task-5': {
      id: 'task-5',
      title: 'Write documentation',
      description: 'Create user and technical documentation',
      deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      assignee: 'Emma Wilson',
      priority: 'medium',
      status: 'done',
      createdAt: new Date().toISOString(),
    },
  },
  columns: {
    todo: {
      id: 'todo',
      title: 'To Do',
      taskIds: ['task-1', 'task-2'],
    },
    inProgress: {
      id: 'inProgress',
      title: 'In Progress',
      taskIds: ['task-3', 'task-4'],
    },
    done: {
      id: 'done',
      title: 'Done',
      taskIds: ['task-5'],
    },
  },
  columnOrder: ['todo', 'inProgress', 'done'],
};