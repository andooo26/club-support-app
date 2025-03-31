import { useEffect, useState } from 'react';

interface Todo {
  project_id: number;
  todo_id: number;
  todo_title: string;
  todo_detail?: string;
  todo_completed: boolean;
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const response = await fetch('/api/todos');
    const data = await response.json();
    setTodos(data);
  }

  async function addTodo() {
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, detail })
    });
    setTitle('');
    setDetail('');
    fetchTodos();
  }

  async function toggleTodo(project_id: number, todo_id: number) {
    await fetch(`/api/todos/${project_id}/${todo_id}`, {
      method: 'PATCH'
    });
    fetchTodos();
  }

  async function deleteTodo(project_id: number, todo_id: number) {
    await fetch(`/api/todos/${project_id}/${todo_id}`, {
      method: 'DELETE'
    });
    fetchTodos();
  }

  return (
    <div>
      <h1>Todoアプリ</h1>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="タイトル" />
      <input value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="詳細" />
      <button onClick={addTodo}>追加</button>

      <ul>
        {todos.map((todo) => (
          <li key={`${todo.project_id}-${todo.todo_id}`}>
            <span style={{ textDecoration: todo.todo_completed ? 'line-through' : 'none' }}>
              {todo.todo_title}: {todo.todo_detail}
            </span>
            <button onClick={() => toggleTodo(todo.project_id, todo.todo_id)}>
              {todo.todo_completed ? '未完了にする' : '完了にする'}
            </button>
            <button onClick={() => deleteTodo(todo.project_id, todo.todo_id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
