

import { useEffect, useState } from 'react';
import { apiFetch } from '../service/api';
import styles from './GlobalView.module.css';

export default function GlobalView() {
  const [allLists, setAllLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/list/global')
      .then(data => {
        setAllLists(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading all system data...</p>;

  return (
    <div className={styles.container}>
      <h1>Global System Overview</h1>
      <div className={styles.grid}>
        {allLists.map(list => (
          <div key={list.listId} className={styles.card}>
            <h3>{list.listName}</h3>
            <p className={styles.meta}>Created by User ID: {list.creatorId}</p>
            
            <ul className={styles.todoList}>
              {list.todos.map(todo => (
                <li key={todo.todoId}>
                  {todo.task} {todo.completed ? '✅' : '⏳'}
                </li>
              ))}
            </ul>
            {list.todos.length === 0 && <p className={styles.empty}>No tasks in this list.</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
