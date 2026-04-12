import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../service/api'; 
import TodoItem from '../components/TodoItem'; 
import styles from './ListDetail.module.css';

export default function ListDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [task, setTask] = useState('');

  useEffect(() => { 
    if (!id) return; 
    apiFetch(`/list/${id}`)
      .then(data => {
        if (!data) throw new Error("List not found");
        setList(data);
      })
      .catch(() => navigate('/'));
  }, [id, navigate]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    try {
      const newTodo = await apiFetch(`/list/${id}/todos`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: task.trim() }) 
      });

      // FIX: Your backend returns a single todo, so we add it to the existing list state
      setList(prev => ({
        ...prev,
        todos: [...prev.todos, newTodo]
      }));
      setTask('');
    } catch (err) { 
      alert("Failed to add task"); 
    }
  };

  const toggleTodo = async (todoId, currentStatus) => {
    try {
      const updatedTodo = await apiFetch(`/list/${id}/todos/${todoId}`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus }) 
      });

      // FIX: Update only the specific todo in the array
      setList(prev => ({
        ...prev,
        todos: prev.todos.map(t => t.id === todoId ? updatedTodo : t)
      }));
    } catch (err) { 
      console.error(err); 
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await apiFetch(`/list/${id}/todos/${todoId}`, { 
        method: 'DELETE'
      });
      
      // FIX: Remove the todo from the local array
      setList(prev => ({
        ...prev,
        todos: prev.todos.filter(t => t.id !== todoId)
      }));
    } catch (err) {
      console.error(err);
    }
  };

  if (!list) return <p className={styles.loading}>Loading tasks...</p>;

  return (
    <div className={styles.container}>
      <button onClick={() => navigate('/')} className={styles.backBtn}>← Back to Lists</button>
      <h1 className={styles.title}>{list.name}</h1>
      
      <form className={styles.addForm} onSubmit={addTask}>
        <input 
          className={styles.inputField}
          value={task} 
          onChange={e => setTask(e.target.value)} 
          placeholder="Add a new task..." 
          required 
        />
        <button type="submit" className={styles.addBtn}>Add</button>
      </form>

      <ul className={styles.todoList}>
        {list.todos?.map(todo => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            onToggle={() => toggleTodo(todo.id, todo.completed)} 
            onDelete={() => deleteTodo(todo.id)}
          />
        ))}
      </ul>
    </div>
  );
}
