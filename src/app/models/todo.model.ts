import { Priority } from "./priority.model";

export type TodoModel = {
    id: string;
    summary: string;
    description?: string;
    priority: Priority;
    isCompleted: boolean;
    completeBy: string;
};