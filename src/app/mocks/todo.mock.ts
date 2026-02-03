import { TodoModel } from '../models/todo.model';

const addDays = (d: number) => new Date(new Date().getTime() + d * 24 * 60 * 60 * 1000);

export const TODO_MOCK_DATA: TodoModel[] = [
  {
    id: '1',
    summary: 'Urgent task - today',
    description: 'Must be done within 24 hours',
    completeBy: addDays(0),
    priority: 1,
    isCompleted: false,
  },
  {
    id: '2',
    summary: 'High priority tomorrow',
    description: 'Deadline tomorrow, still urgent',
    completeBy: addDays(1),
    priority: 1,
    isCompleted: false,
  },
  {
    id: '3',
    summary: 'High priority later',
    description: 'Priority 1 but deadline later',
    completeBy: addDays(5),
    priority: 1,
    isCompleted: false,
  },
  {
    id: '4',
    summary: 'Medium priority task',
    description: 'Priority 2 task',
    completeBy: addDays(2),
    priority: 2,
    isCompleted: false,
  },
  {
    id: '5',
    summary: 'Low priority no deadline',
    priority: 3,
    completeBy: addDays(5),
    isCompleted: false,
  },
  {
    id: '6',
    summary: 'Completed task recently',
    description: 'Can undo in this session',
    completeBy: addDays(-1),
    priority: 2,
    isCompleted: true,
  },
];
