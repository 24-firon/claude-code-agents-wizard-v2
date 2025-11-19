/**
 * Todo item interface
 */
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

/**
 * Filter options for displaying todos
 */
export type TodoFilter = 'all' | 'active' | 'completed';

/**
 * Props for TodoItem component
 */
export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

/**
 * Props for TodoList component
 */
export interface TodoListProps {
  todos: Todo[];
  filter: TodoFilter;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

/**
 * Props for AddTodo component
 */
export interface AddTodoProps {
  onAdd: (text: string) => void;
}
