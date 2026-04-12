import { useEffect, useState } from 'react';
import { apiFetch } from '../service/api'; 
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

export default function Home() {
  const [lists, setLists] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null); 
  const [editValue, setEditValue] = useState('');   
  const navigate = useNavigate();

  // Load All Lists
  useEffect(() => { 
    apiFetch('/list')
      .then(data => setLists(Array.isArray(data) ? data : []))
      .catch(console.error); 
  }, []);

  const addList = async (e) => {
    e.preventDefault();
    try {
      const newList = await apiFetch('/list', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }) 
      });
      // Ensure we add the new list to the UI
      setLists(prev => [...prev, newList]);
      setName('');
    } catch (err) { 
      alert("Failed to add list"); 
    }
  };

  const saveEdit = async (listId) => {
    // If empty or no change, just close the edit mode
    const originalList = lists.find(l => l.id === listId);
    if (!editValue.trim() || editValue.trim() === originalList?.name) {
      setEditingId(null);
      return;
    }

    try {
      const updated = await apiFetch(`/list/${listId}`, { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editValue.trim() }) 
      });

      // Update state: replace the specific list object
      setLists(prev => prev.map(l => (l.id === listId ? updated : l)));
      setEditingId(null);
    } catch (err) { 
      console.error("Update failed:", err);
      setEditingId(null); // Close edit mode even on error to reset UI
    }
  };

  // Handle Enter key for saving
  const handleKeyDown = (e, listId) => {
    if (e.key === 'Enter') {
      saveEdit(listId);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
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
            {editingId === list.id ? (
              <div className={styles.editSection}>
                <input 
                  className={styles.input}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => saveEdit(list.id)} 
                  onKeyDown={(e) => handleKeyDown(e, list.id)}
                  autoFocus
                />
              </div>
            ) : (
              <>
                <h3 
                  className={styles.listTitle} 
                  onClick={() => navigate(`/list/${list.id}`)}
                >
                  {list.name}
                </h3>

                <div className={styles.actions}>
                  <button 
                    className={styles.editBtn} 
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(list.id);
                      setEditValue(list.name);
                    }}
                  >
                    Edit Name
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


