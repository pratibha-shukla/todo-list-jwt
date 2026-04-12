import { useEffect, useState } from 'react';
import { apiFetch } from '../service/api'; 
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import toast from 'react-hot-toast'; // Added for better feedback

export default function Home() {
  const [lists, setLists] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null); 
  const [editValue, setEditValue] = useState('');   
  const navigate = useNavigate();

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
      setLists(prev => [...prev, newList]);
      setName('');
      toast.success('List created!');
    } catch (err) { 
      toast.error("Failed to add list"); 
    }
  };

  const saveEdit = async (listId) => {
    const originalList = lists.find(l => l.listId === listId); // FIX: listId
    if (!editValue.trim() || editValue.trim() === originalList?.listName) { // FIX: listName
      setEditingId(null);
      return;
    }

    try {
      const updated = await apiFetch(`/list/${listId}`, { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editValue.trim() }) 
      });

      // FIX: Replace list using listId and listName
      setLists(prev => prev.map(l => (l.listId === listId ? updated : l)));
      setEditingId(null);
      toast.success('Name updated');
    } catch (err) { 
      console.error("Update failed:", err);
      setEditingId(null);
    }
  };

  const handleKeyDown = (e, listId) => {
    if (e.key === 'Enter') saveEdit(listId);
    if (e.key === 'Escape') setEditingId(null);
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
          <div key={list.listId} className={styles.listCard}> {/* FIX: listId */}
            {editingId === list.listId ? (
              <div className={styles.editSection}>
                <input 
                  className={styles.input}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => saveEdit(list.listId)} 
                  onKeyDown={(e) => handleKeyDown(e, list.listId)}
                  autoFocus
                />
              </div>
            ) : (
              <>
                <h3 
                  className={styles.listTitle} 
                  onClick={() => navigate(`/list/${list.listId}`)} // FIX: listId
                >
                  {list.listName} {/* FIX: listName */}
                </h3>

                <div className={styles.actions}>
                  <button 
                    className={styles.editBtn} 
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(list.listId);
                      setEditValue(list.listName); // FIX: listName
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



