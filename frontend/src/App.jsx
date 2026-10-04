import { useEffect, useState } from 'react';
import { getTasks, addTask, updateTask, deleteTask } from './api';
import TaskForm from './components/TaskForm.jsx';
import TaskItem from './components/TaskItem.jsx';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all tasks once, when the page loads
  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (title) => {
    try {
      setError('');
      const created = await addTask(title);
      setTasks((prev) => [created, ...prev]);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleUpdate = async (id, changes) => {
    try {
      setError('');
      const updated = await updateTask(id, changes);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError('');
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  const remaining = tasks.filter((t) => !t.completed).length;

  return (
    <main className="app">
      <h1>My Tasks</h1>
      <TaskForm onAdd={handleAdd} />

      {error && <p className="error" role="alert">{error}</p>}

      {loading ? (
        <p className="muted">Loading tasks…</p>
      ) : tasks.length === 0 ? (
        <p className="muted">No tasks yet. Add your first one above.</p>
      ) : (
        <>
          <p className="muted">{remaining} of {tasks.length} left to do</p>
          <ul className="list">
            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
