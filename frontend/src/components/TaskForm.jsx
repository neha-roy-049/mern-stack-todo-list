import { useState } from 'react';

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();               // stop the full page reload
    if (!title.trim()) return;
    await onAdd(title.trim());
    setTitle('');
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs doing?"
        aria-label="New task"
      />
      <button type="submit">Add task</button>
    </form>
  );
}
