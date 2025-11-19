import { useTodos } from './hooks/useTodos';
import { AddTodo } from './components/AddTodo';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './types/todo';

function App() {
  const {
    todos,
    filter,
    stats,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
  } = useTodos();

  const filters: { value: TodoFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            React Todo App
          </h1>
          <p className="text-gray-600">
            Built with Claude Code Agent System
          </p>
        </header>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Add Todo Form */}
          <AddTodo onAdd={addTodo} />

          {/* Stats */}
          <div className="mb-6 flex gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">{stats.total}</span> total
            </div>
            <div>
              <span className="font-medium text-primary-600">{stats.active}</span> active
            </div>
            <div>
              <span className="font-medium text-green-600">{stats.completed}</span> completed
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-pressed={filter === f.value}
              >
                {f.label}
              </button>
            ))}
            {stats.completed > 0 && (
              <button
                onClick={clearCompleted}
                className="ml-auto px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
              >
                Clear Completed
              </button>
            )}
          </div>

          {/* Todo List */}
          <TodoList
            todos={todos}
            filter={filter}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
          />
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-600">
          <p>
            Example project from{' '}
            <a
              href="https://github.com/IncomeStreamSurfer/claude-code-agents-wizard-v2"
              className="text-primary-600 hover:text-primary-700 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Claude Code Agents Wizard
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
