import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiFetch from '../service/api';
import styles from './ListDetail.module.css';

export default function ListDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [task, setTask] = useState('');

  useEffect(() => { 
    apiFetch(`/list/${id}`)
      .then(setList)
      .catch(() => navigate('/')); // Redirect if list doesn't exist
  }, [id, navigate]);

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const newTodo = await apiFetch(`/list/${id}/todo`, { 
        method: 'POST', 
        body: JSON.stringify({ task }) 
      });
      setList({ ...list, todos: [...list.todos, newTodo] });
      setTask('');
    } catch (err) { alert("Failed to add task"); }
  };

  const toggleTodo = async (todoId) => {
    try {
      await apiFetch(`/todo/${todoId}/toggle`, { method: 'PATCH' });
      const updated = list.todos.map(t => 
        t.id === todoId ? { ...t, completed: !t.completed } : t
      );
      setList({ ...list, todos: updated });
    } catch (err) { console.error(err); }
  };

  if (!list) return <p className={styles.loading}>Loading tasks...</p>;

  return (
    <div className={styles.container}>
      <button onClick={() => navigate('/')} style={{cursor: 'pointer', background: 'none', border: 'none', color: '#64748b', marginBottom: '1rem'}}>← Back to Lists</button>
      <h1 className={styles.title}>{list.name}</h1>
      
      <form className={styles.addForm} onSubmit={addTask}>
        <input 
          className={styles.inputField}
          value={task} 
          onChange={e => setTask(e.target.value)} 
          placeholder="Add a new task..." 
          required 
        />
        <button className={styles.addBtn}>Add</button>
      </form>

      <ul className={styles.todoList}>
        {list.todos?.map(todo => (
          <li key={todo.id} className={styles.todoItem}>
            <input 
              className={styles.checkbox}
              type="checkbox" 
              checked={todo.completed} 
              onChange={() => toggleTodo(todo.id)} 
            />
            <span className={`${styles.taskText} ${todo.completed ? styles.completed : ''}`}>
              {todo.task}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

