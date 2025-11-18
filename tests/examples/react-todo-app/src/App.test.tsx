import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders app title', () => {
    render(<App />);
    expect(screen.getByText('React Todo App')).toBeInTheDocument();
  });

  it('renders empty state when no todos', () => {
    render(<App />);
    expect(screen.getByText('No todos')).toBeInTheDocument();
  });

  it('adds a new todo', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('What needs to be done?');
    const addButton = screen.getByText('Add Todo');

    await user.type(input, 'Test todo item');
    await user.click(addButton);

    expect(screen.getByText('Test todo item')).toBeInTheDocument();
  });

  it('does not add empty todo', async () => {
    const user = userEvent.setup();
    render(<App />);

    const addButton = screen.getByText('Add Todo');
    await user.click(addButton);

    expect(screen.getByText('No todos')).toBeInTheDocument();
  });

  it('toggles todo completion', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'Test todo');
    await user.click(screen.getByText('Add Todo'));

    // Toggle it
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it('deletes a todo', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'Test todo');
    await user.click(screen.getByText('Add Todo'));

    // Delete it
    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);

    expect(screen.queryByText('Test todo')).not.toBeInTheDocument();
  });

  it('edits a todo', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'Original text');
    await user.click(screen.getByText('Add Todo'));

    // Edit it
    const editButton = screen.getByText('Edit');
    await user.click(editButton);

    const editInput = screen.getByDisplayValue('Original text');
    await user.clear(editInput);
    await user.type(editInput, 'Updated text');
    await user.click(screen.getByText('Save'));

    expect(screen.getByText('Updated text')).toBeInTheDocument();
    expect(screen.queryByText('Original text')).not.toBeInTheDocument();
  });

  it('cancels editing a todo', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'Original text');
    await user.click(screen.getByText('Add Todo'));

    // Start editing
    await user.click(screen.getByText('Edit'));

    // Cancel
    await user.click(screen.getByText('Cancel'));

    expect(screen.getByText('Original text')).toBeInTheDocument();
  });

  it('filters todos correctly', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add multiple todos
    const input = screen.getByPlaceholderText('What needs to be done?');

    await user.type(input, 'Active todo');
    await user.click(screen.getByText('Add Todo'));

    await user.type(input, 'Completed todo');
    await user.click(screen.getByText('Add Todo'));

    // Complete one todo
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]);

    // Filter active
    await user.click(screen.getByText('Active'));
    expect(screen.getByText('Active todo')).toBeInTheDocument();
    expect(screen.queryByText('Completed todo')).not.toBeInTheDocument();

    // Filter completed
    await user.click(screen.getByText('Completed'));
    expect(screen.queryByText('Active todo')).not.toBeInTheDocument();
    expect(screen.getByText('Completed todo')).toBeInTheDocument();

    // Filter all
    await user.click(screen.getByText('All'));
    expect(screen.getByText('Active todo')).toBeInTheDocument();
    expect(screen.getByText('Completed todo')).toBeInTheDocument();
  });

  it('clears completed todos', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add and complete a todo
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'Completed todo');
    await user.click(screen.getByText('Add Todo'));

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    // Clear completed
    const clearButton = screen.getByText('Clear Completed');
    await user.click(clearButton);

    expect(screen.queryByText('Completed todo')).not.toBeInTheDocument();
  });

  it('displays correct stats', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add multiple todos
    const input = screen.getByPlaceholderText('What needs to be done?');

    await user.type(input, 'Todo 1');
    await user.click(screen.getByText('Add Todo'));

    await user.type(input, 'Todo 2');
    await user.click(screen.getByText('Add Todo'));

    await user.type(input, 'Todo 3');
    await user.click(screen.getByText('Add Todo'));

    // Complete one
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    // Check stats
    expect(screen.getByText(/3.*total/)).toBeInTheDocument();
    expect(screen.getByText(/2.*active/)).toBeInTheDocument();
    expect(screen.getByText(/1.*completed/)).toBeInTheDocument();
  });
});
