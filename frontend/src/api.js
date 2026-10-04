// All backend calls live here, so components stay simple.
const BASE = '/api/tasks';

async function request(url, options) {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

const json = (method, body) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const getTasks = () => request(BASE);
export const addTask = (title) => request(BASE, json('POST', { title }));
export const updateTask = (id, changes) => request(`${BASE}/${id}`, json('PUT', changes));
export const deleteTask = (id) => request(`${BASE}/${id}`, { method: 'DELETE' });
