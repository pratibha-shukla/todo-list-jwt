import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiFetch from '../service/api';
import styles from './ListDetail.module.css';

export default function ListDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [task, setTask] = useState('');

  // GET LIST + TODOS
  useEffect(() => { 
    apiFetch(`/list/${id}`)
      .then(setList)
      .catch(() => navigate('/'));
  }, [id, navigate]);

  // ADD TODO  (correct backend route)
  const addTask = async (e) => {
    e.preventDefault();
    try {
      const newTodo = await apiFetch(`/list/${id}/todos`, { 
        method: 'POST', 
        body: JSON.stringify({ task }) 
      });

      setList({ ...list, todos: [...list.todos, newTodo] });
      setTask('');
    } catch (err) { 
      alert("Failed to add task"); 
    }
  };

  // TOGGLE TODO (correct backend route)
  const toggleTodo = async (todoId) => {
    try {
      const updatedTodo = await apiFetch(`/list/${id}/todos/${todoId}`, { 
        method: 'PATCH',
        body: JSON.stringify({ completed: !list.todos.find(t => t._id === todoId).completed })
      });

      const updated = list.todos.map(t => 
        t._id === todoId ? updatedTodo : t
      );

      setList({ ...list, todos: updated });
    } catch (err) { 
      console.error(err); 
    }
  };

  if (!list) return <p className={styles.loading}>Loading tasks...</p>;

  return (
    <div className={styles.container}>
      <button 
        onClick={() => navigate('/')} 
        style={{cursor: 'pointer', background: 'none', border: 'none', color: '#64748b', marginBottom: '1rem'}}
      >
        ← Back to Lists
      </button>

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
          <li key={todo._id} className={styles.todoItem}>
            <input 
              className={styles.checkbox}
              type="checkbox" 
              checked={todo.completed} 
              onChange={() => toggleTodo(todo._id)} 
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

