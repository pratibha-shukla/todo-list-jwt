import { useEffect, useState } from 'react';
import { apiFetch } from '../service/api'; 
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css'; // Add this import

export default function Home() {
  const [lists, setLists] = useState([]);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => { 
    apiFetch('/list')
      .then(data => setLists(Array.isArray(data) ? data : []))
      .catch(console.error); 
  }, []);

  const addList = async (e) => {
    e.preventDefault();
    try {
      const newList = await apiFetch('/list', { method: 'POST', body: JSON.stringify({ name }) });
      setLists([...lists, newList]);
      setName('');
    } catch (err) { alert("Failed to add list"); }
  };

  const deleteList = async (id) => {
    if (!window.confirm("Delete this list?")) return;
    try {
      await apiFetch(`/list/${id}`, { method: 'DELETE' });
      setLists(lists.filter(l => l.id !== id));
    } catch (err) { console.error(err); }
  };

  const editList = async (list) => {
    const newName = prompt("Rename list:", list.name);
    if (!newName || newName === list.name) return;
    try {
      const updated = await apiFetch(`/list/${list.id}`, { method: 'PUT', body: JSON.stringify({ name: newName }) });
      setLists(lists.map(l => l.id === list.id ? updated : l));
    } catch (err) { console.error(err); }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Workspace</h2>
      
      <form className={styles.addForm} onSubmit={addList}>
        <input 
          className={styles.input}
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="New list name" 
          required 
        />
        <button className={styles.addBtn}>Create List</button>
      </form>

      <div className={styles.listGrid}>
        {lists.map(list => (
          <div key={list.id} className={styles.listCard}>
            <h3 className={styles.listTitle} onClick={() => navigate(`/list/${list.id}`)}>
              {list.name}
            </h3>
            <div className={styles.actions}>
              <button className={styles.editBtn} onClick={() => editList(list)}>Edit</button>
              <button className={styles.deleteBtn} onClick={() => deleteList(list.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



