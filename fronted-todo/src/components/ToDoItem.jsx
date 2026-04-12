import styles from './TodoItem.module.css';

export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={styles.todoItem}>
      <div className={styles.content}>
        <input 
          className={styles.checkbox}
          type="checkbox" 
          checked={todo.completed} 
          onChange={() => onToggle(todo.id)} 
        />
        <span className={todo.completed ? styles.completedText : styles.taskText}>
          {todo.task}
        </span>
      </div>
      
      <button 
        className={styles.deleteBtn} 
        onClick={() => onDelete(todo.id)}
        aria-label="Delete task"
      >
        ×
      </button>
    </li>
  );
}
