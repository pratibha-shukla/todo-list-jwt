import styles from './TodoItem.module.css';

export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={styles.todoItem}>
      <div className={styles.content}>
        <input 
          className={styles.checkbox}
          type="checkbox" 
          // Use todo.completed as per your controller
          checked={todo.completed} 
          // Pass the MongoDB _id and the current status
          onChange={() => onToggle(todo._id, todo.completed)} 
        />
        <span className={todo.completed ? styles.completedText : styles.taskText}>
          {/* Your controller uses 'task' for the text field */}
          {todo.task}
        </span>
      </div>
      
      <button 
        className={styles.deleteBtn} 
        // Pass the MongoDB _id
        onClick={() => onDelete(todo._id)}
        aria-label="Delete task"
      >
        ×
      </button>
    </li>
  );
}
