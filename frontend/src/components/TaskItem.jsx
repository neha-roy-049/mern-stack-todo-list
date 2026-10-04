import { useState } from 'react';

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  const saveEdit = async () => {
    const title = draft.trim();
    if (title && title !== task.title) await onUpdate(task._id, { title });
    setEditing(false);
  };

  return (
    <li className={`item ${task.completed ? 'done' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onUpdate(task._id, { completed: !task.completed })}
        aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
      />

      {editing ? (
        <input
          className="edit"
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') saveEdit();
            if (e.key === 'Escape') { setDraft(task.title); setEditing(false); }
          }}
        />
      ) : (
        <span className="title" onDoubleClick={() => setEditing(true)} title="Double-click to edit">
          {task.title}
        </span>
      )}

      <button className="delete" onClick={() => onDelete(task._id)} aria-label={`Delete "${task.title}"`}>
        Delete
      </button>
    </li>
  );
}
