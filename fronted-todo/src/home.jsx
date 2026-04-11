

import { useEffect, useState } from 'react';
import { apiFetch } from './api';

 function Home() {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    apiFetch('/lists')
      .then(data => setLists(data))
      .catch(err => console.error("Failed to load lists", err));
  }, []);

  return (
    <div className="todo-dashboard">
      <h1>My Todo Lists</h1>
      {lists.length === 0 ? <p>No lists found. Please login.</p> : 
        lists.map(list => (
          <div key={list.id} className="list-group">
            <h3>{list.name}</h3>
            {/* Add your list items here */}
          </div>
        ))
      }
    </div>
  );
}
export default Home;
