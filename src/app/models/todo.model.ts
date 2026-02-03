export interface TodoModel {
  id: string;
  summary: string;
  description?: string;
  priority: 1 | 2 | 3;
  isCompleted: boolean;
  completeBy: Date;
}
