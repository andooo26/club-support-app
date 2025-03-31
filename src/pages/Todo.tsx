import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Todo {
  project_id: number;
  todo_id: number;
  todo_title: string;
  todo_detail?: string;
  todo_completed: boolean;
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.project_id) {
      setError('ログインしてください');
      return;
    }
    fetchTodos(session.user.project_id);
  }, [session]);

  async function fetchTodos(projectId: number) {
    try {
      const response = await fetch(`/api/todos?project_id=${projectId}`);
      if (!response.ok) {
        throw new Error('データの取得に失敗しました。');
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('データの取得に失敗しました。');
    }
  }

  return (
    <div>
      <h1>{session?.user?.name} の Todo 一覧</h1>
      {error ? (
        <p>{error}</p>
      ) : todos.length === 0 ? (
        <p>Todoはありません。</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={`${todo.project_id}-${todo.todo_id}`}>
              <span style={{ textDecoration: todo.todo_completed ? 'line-through' : 'none' }}>
                {todo.todo_title}: {todo.todo_detail}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
