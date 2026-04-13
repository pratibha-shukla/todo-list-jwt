import { useState } from 'react';
import styles from './TodoItem.module.css';

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(todo.task);
  // Prefer API `todoId`, fallback to legacy `id`
  const todoId = todo.todoId ?? todo.id;

  const handleSave = () => {
    const trimmedName = newName.trim();
    if (trimmedName && trimmedName !== todo.task) {
      // Pass ID first, then name to match ListDetail's editTodo(todoId, newTaskName)
      onEdit(todoId, trimmedName);
    } else {
      setNewName(todo.task);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setNewName(todo.task);
      setIsEditing(false);
    }
  };

  return (
   <li className={styles.todoItem}>
  <div className={styles.content}>
    <input 
      className={styles.checkbox}
      type="checkbox" 
      checked={todo.completed} 
      // FIX: Ensure you are using todoId and add a log to test
      onChange={() => {
        console.log("Checkbox clicked for Todo ID:", todoId);
        onToggle(todoId, todo.completed);
      }} 
    />

        
        {isEditing ? (
          <input 
            className={styles.editInput}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave} 
            autoFocus
          />
        ) : (
          <span 
            className={todo.completed ? styles.completedText : styles.taskText}
            onClick={() => setIsEditing(true)} // Optional: click text to edit
          >
            {todo.task}
          </span>
        )}
      </div>
      
      <div className={styles.actions}>
        {isEditing ? (
          <button onClick={handleSave} className={styles.saveBtn}>✅</button>
        ) : (
          <button onClick={() => setIsEditing(true)} className={styles.editBtn}>✏️</button>
        )}
        
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(todoId)}
          title="Delete task"
        >
          🗑️
        </button>
      </div>
    </li>
  );
}
