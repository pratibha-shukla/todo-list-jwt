import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../service/api'; 
import TodoItem from '../components/TodoItem'; 
import styles from './ListDetail.module.css';
// FIX: Import 'toast' directly and REMOVE 'Toaster'
import toast from 'react-hot-toast'; 

export default function ListDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [task, setTask] = useState('');

  // 1. STATS CALCULATION
  const totalTasks = list?.todos?.length || 0;
  const completedTasks = list?.todos?.filter(t => t.completed).length || 0;
  const inProgressTasks = totalTasks - completedTasks;

  useEffect(() => { 
    if (!id) return; 
    apiFetch(`/list/${id}`)
      .then(data => {
        if (!data) throw new Error("List not found");
        // Normalize todos so each todo always exposes `todoId`
        const normalized = {
          ...data,
          todos: data.todos?.map(t => ({ ...t, todoId: t.todoId ?? t.id })) || []
        };
        setList(normalized);
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

      // Backend returns todoId, so this syncs perfectly
      const normalizedNew = { ...newTodo, todoId: newTodo.todoId ?? newTodo.id };
      setList(prev => ({
        ...prev,
        todos: [...prev.todos, normalizedNew]
      }));
      setTask('');
      toast.success('Task added');
    } catch (err) { 
      toast.error("Failed to add task"); 
    }
  };

  const toggleTodo = async (todoId, currentStatus) => {
    try {
      const updatedTodo = await apiFetch(`/list/${id}/todos/${todoId}`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus }) 
      });

      setList(prev => ({
        ...prev,
        todos: prev.todos.map(t => (t.todoId == todoId ? updatedTodo : t))
      }));
    } catch (err) { 
      console.error(err); 
    }
  };

const editTodo = async (todoId, newTaskName) => {
  // FIX: Add a safety check for newTaskName
  if (!newTaskName || typeof newTaskName !== 'string' || !newTaskName.trim()) {
     return; 
  }

  try {
    const updatedTodo = await apiFetch(`/list/${id}/todos/${todoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: newTaskName.trim() })
    });

    setList(prev => ({
      ...prev,
      todos: prev.todos.map(t => (t.todoId == todoId ? updatedTodo : t))
    }));
    
    toast.success('Task updated');
  } catch (err) {
    toast.error('Failed to update task');
  }
};


  const deleteTodo = async (todoId) => {
    try {
      await apiFetch(`/list/${id}/todos/${todoId}`, { 
        method: 'DELETE'
      });
      
      setList(prev => ({
        ...prev,
        todos: prev.todos.filter(t => t.todoId != todoId)
      }));
      toast.success('Task deleted');
    } catch (err) {
      console.error(err);
    }
  };

  if (!list) return <p className={styles.loading}>Loading tasks...</p>;

  return (
    <div className={styles.container}>
      <button onClick={() => navigate('/')} className={styles.backBtn}>← Back to Lists</button>
      
      {/* Ensure you use listName to match your new backend helper */}
      <h1 className={styles.title}>{list.listName}</h1>

      <div className={styles.statsBar} style={{ display: 'flex', gap: '15px', marginBottom: '20px', fontSize: '0.9rem' }}>
        <span>Total: <b>{totalTasks}</b></span>
        <span style={{ color: 'green' }}>Completed: <b>{completedTasks}</b></span>
        <span style={{ color: 'orange' }}>In Progress: <b>{inProgressTasks}</b></span>
      </div>
      
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
        key={todo.todoId ?? todo.id}
        todo={todo}
        onToggle={toggleTodo}
        onEdit={editTodo}
        onDelete={deleteTodo}
      />
    ))}
  </ul>
      {totalTasks === 0 && (
        <div style={{ textAlign: 'center', marginTop: '40px', opacity: 0.5 }}>
          <p>No tasks yet. Start by adding one above!</p>
        </div>
      )}
    </div>
  );
}

