import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let tasks = {};
let columns = {
  todo: {
    id: 'todo',
    title: 'To Do',
    taskIds: [],
  },
  inProgress: {
    id: 'inProgress',
    title: 'In Progress',
    taskIds: [],
  },
  done: {
    id: 'done',
    title: 'Done',
    taskIds: [],
  },
};
let columnOrder = ['todo', 'inProgress', 'done'];

const initializeSampleData = () => {
  const sampleTasks = {
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
  };
  
  tasks = sampleTasks;
  columns.todo.taskIds = ['task-1', 'task-2'];
  columns.inProgress.taskIds = ['task-3'];
};

initializeSampleData();


app.get('/api/board', (req, res) => {
  const boardData = {
    tasks,
    columns,
    columnOrder,
  };
  res.json(boardData);
});

app.post('/api/tasks', (req, res) => {
  const { title, description, deadline, assignee, priority, status } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const id = uuidv4();
  const newTask = {
    id,
    title,
    description: description || '',
    deadline: deadline || '',
    assignee: assignee || '',
    priority: priority || 'medium',
    status: status || 'todo',
    createdAt: new Date().toISOString(),
  };
  
  tasks[id] = newTask;
  
  columns[newTask.status].taskIds.push(id);
  
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, deadline, assignee, priority, status } = req.body;
  
  if (!tasks[id]) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const oldStatus = tasks[id].status;
  const newStatus = status || oldStatus;
  
  tasks[id] = {
    ...tasks[id],
    title: title || tasks[id].title,
    description: description !== undefined ? description : tasks[id].description,
    deadline: deadline !== undefined ? deadline : tasks[id].deadline,
    assignee: assignee !== undefined ? assignee : tasks[id].assignee,
    priority: priority || tasks[id].priority,
    status: newStatus,
  };
  
  if (oldStatus !== newStatus) {
    columns[oldStatus].taskIds = columns[oldStatus].taskIds.filter(
      taskId => taskId !== id
    );
    
    columns[newStatus].taskIds.push(id);
  }
  
  res.json(tasks[id]);
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  
  if (!tasks[id]) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const status = tasks[id].status;
  
  columns[status].taskIds = columns[status].taskIds.filter(
    taskId => taskId !== id
  );
  
  delete tasks[id];
  
  res.json({ message: 'Task deleted successfully' });
});

app.put('/api/columns/order', (req, res) => {
  const { order } = req.body;
  
  if (!order || !Array.isArray(order) || order.length !== columnOrder.length) {
    return res.status(400).json({ error: 'Invalid column order' });
  }
  
  columnOrder = order;
  res.json({ columnOrder });
});

app.post('/api/tasks/:id/move', (req, res) => {
  const { id } = req.params;
  const { sourceId, destinationId, sourceIndex, destinationIndex } = req.body;
  
  if (!tasks[id]) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  columns[sourceId].taskIds.splice(sourceIndex, 1);
  
  columns[destinationId].taskIds.splice(destinationIndex, 0, id);
  
  tasks[id].status = destinationId;
  
  res.json({
    task: tasks[id],
    columns: {
      [sourceId]: columns[sourceId],
      [destinationId]: columns[destinationId],
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;