
 const TodoHome = ({ lists, onAddTodo, onToggle, onDelete, todoInputs, setTodoInputs }) => (
  <main>
    {lists.map(list => (
      <section key={list.id}>
        <h3>{list.name}</h3>
        <ul>
          {list.visibleTodos.map(todo => (
            <li key={todo.id}>
              <input type="checkbox" checked={todo.completed} onChange={() => onToggle(list.id, todo)} />
              <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.task}</span>
              <button onClick={() => onDelete(list.id, todo.id)}>x</button>
            </li>
          ))}
        </ul>
        <form onSubmit={(e) => onAddTodo(e, list.id)}>
          <input 
            value={todoInputs[list.id] || ''} 
            onChange={(e) => setTodoInputs({...todoInputs, [list.id]: e.target.value})} 
            placeholder="New task..." 
          />
        </form>
      </section>
    ))}
  </main>
);

export default TodoHome;

