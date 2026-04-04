import { useEffect, useMemo, useState, startTransition } from 'react';

const emptyAuthForm = { username: '', password: '' };

async function apiFetch(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed');
  }

  return payload;
}

export default function App() {
  const [mode, setMode] = useState('login');
  const [authForm, setAuthForm] = useState(emptyAuthForm);
  const [user, setUser] = useState(null);
  const [lists, setLists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewFilter, setViewFilter] = useState('all');
  const [newListName, setNewListName] = useState('');
  const [todoInputs, setTodoInputs] = useState({});
  const [editingListId, setEditingListId] = useState(null);
  const [editingListName, setEditingListName] = useState('');
  const [statusMessage, setStatusMessage] = useState('Checking your session...');
  const [errorMessage, setErrorMessage] = useState('');
  const [isBusy, setIsBusy] = useState(true);

  const completedTodos = useMemo(
    () => lists.flatMap((list) => list.todos || []).filter((todo) => todo.completed).length,
    [lists]
  );

  const totalTodos = useMemo(
    () => lists.flatMap((list) => list.todos || []).length,
    [lists]
  );

  const pendingTodos = totalTodos - completedTodos;
  const completionLabel =
    totalTodos === 0 ? 'Fresh start' : `${progressValuePlaceholder(totalTodos, completedTodos)} complete`;

  const filteredLists = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return lists
      .map((list) => {
        const visibleTodos = (list.todos || []).filter((todo) => {
          const matchesSearch =
            !normalizedSearch ||
            list.name.toLowerCase().includes(normalizedSearch) ||
            todo.task.toLowerCase().includes(normalizedSearch);

          const matchesFilter =
            viewFilter === 'all' ||
            (viewFilter === 'active' && !todo.completed) ||
            (viewFilter === 'completed' && todo.completed);

          return matchesSearch && matchesFilter;
        });

        const listMatchesSearch =
          !normalizedSearch || list.name.toLowerCase().includes(normalizedSearch);

        if (!visibleTodos.length && !listMatchesSearch) {
          return null;
        }

        return {
          ...list,
          visibleTodos
        };
      })
      .filter(Boolean);
  }, [lists, searchTerm, viewFilter]);

  function progressValuePlaceholder(allTodos, doneTodos) {
    return `${Math.round((doneTodos / allTodos) * 100)}%`;
  }

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    try {
      const currentUser = await apiFetch('/auth/me');
      setUser(currentUser);
      await loadLists();
      setStatusMessage(`Welcome back, ${currentUser.username}.`);
      setErrorMessage('');
    } catch (error) {
      setUser(null);
      setLists([]);
      setStatusMessage('Sign in to start organizing your work.');
    } finally {
      setIsBusy(false);
    }
  }

  async function loadLists() {
    const data = await apiFetch('/lists');
    startTransition(() => {
      setLists(data);
    });
  }

  function updateAuthField(event) {
    const { name, value } = event.target;
    setAuthForm((current) => ({ ...current, [name]: value }));
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setIsBusy(true);
    setErrorMessage('');

    try {
      if (mode === 'signup') {
        const signupResult = await apiFetch('/auth/signup', {
          method: 'POST',
          body: JSON.stringify(authForm)
        });

      setStatusMessage(`${signupResult.username} is ready. You can sign in now.`);
      setStatusMessage(`${signupResult.username} is ready. You can log in now.`);
      setMode('login');
      setAuthForm(emptyAuthForm);
      return;
      }

      const loginResult = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(authForm)
      });

      setUser(loginResult.user);
      setAuthForm(emptyAuthForm);
      await loadLists();
      setStatusMessage(`Hi ${loginResult.user.username}, your workspace is ready.`);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleLogout() {
    setIsBusy(true);
    setErrorMessage('');

    try {
      await apiFetch('/auth/logout', { method: 'POST' });
      setUser(null);
      setLists([]);
      setAuthForm(emptyAuthForm);
      setStatusMessage('You have been signed out.');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleCreateList(event) {
    event.preventDefault();

    if (!newListName.trim()) {
      setErrorMessage('Give the new list a name first.');
      return;
    }

    setIsBusy(true);
    setErrorMessage('');

    try {
      await apiFetch('/lists', {
        method: 'POST',
        body: JSON.stringify({ name: newListName })
      });
      setNewListName('');
      await loadLists();
      setStatusMessage('New list created.');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleAddTodo(event, listId) {
    event.preventDefault();
    const task = (todoInputs[listId] || '').trim();

    if (!task) {
      setErrorMessage('Add a task before submitting.');
      return;
    }

    setIsBusy(true);
    setErrorMessage('');

    try {
      await apiFetch(`/lists/${listId}/todos`, {
        method: 'POST',
        body: JSON.stringify({ task })
      });
      setTodoInputs((current) => ({ ...current, [listId]: '' }));
      await loadLists();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleToggleTodo(listId, todo) {
    setIsBusy(true);
    setErrorMessage('');

    try {
      await apiFetch(`/lists/${listId}/todos/${todo.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: !todo.completed })
      });
      await loadLists();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleDeleteTodo(listId, todoId) {
    setIsBusy(true);
    setErrorMessage('');

    try {
      await apiFetch(`/lists/${listId}/todos/${todoId}`, {
        method: 'DELETE'
      });
      await loadLists();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleRenameList(event, listId) {
    event.preventDefault();

    if (!editingListName.trim()) {
      setErrorMessage('List names cannot be empty.');
      return;
    }

    setIsBusy(true);
    setErrorMessage('');

    try {
      await apiFetch(`/lists/${listId}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: editingListName })
      });
      setEditingListId(null);
      setEditingListName('');
      await loadLists();
      setStatusMessage('List updated.');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsBusy(false);
    }
  }

  const progressValue = totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);
  const spotlightMessage =
    pendingTodos === 0 && totalTodos > 0
      ? 'Everything is complete. This is a good moment to plan what comes next.'
      : pendingTodos > 0
        ? `${pendingTodos} task${pendingTodos === 1 ? '' : 's'} still need attention.`
        : 'Create your first list to get this workspace moving.';

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <main className="main-layout">
        <section className="hero-panel">
          <div className="hero-topline">
            <p className="eyebrow">Task Canvas</p>
            <span className="hero-chip">{completionLabel}</span>
          </div>

          <h1>A todo app that feels clear, fast, and satisfying to use.</h1>
          <p className="hero-copy">
            Organize tasks into focused lists, track progress instantly, and keep the next
            thing to do visible without clutter.
          </p>

          <div className="focus-panel">
            <p className="focus-label">Today&apos;s focus</p>
            <strong>{spotlightMessage}</strong>
          </div>

          <div className="hero-stats">
            <article>
              <span>{lists.length}</span>
              <p>Active lists</p>
            </article>
            <article>
              <span>{completedTodos}</span>
              <p>Tasks done</p>
            </article>
            <article>
              <span>{pendingTodos}</span>
              <p>Still open</p>
            </article>
          </div>

          <div className="progress-summary">
            <div className="hero-progress">
              <div className="hero-progress-bar" style={{ width: `${progressValue}%` }} />
            </div>
            <span>{progressValue}% complete</span>
          </div>
        </section>

        <section className="workspace-panel">
          {!user ? (
            <div className="auth-card">
              <div className="auth-tabs">
                <button
                  className={mode === 'login' ? 'active' : ''}
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                  }}
                  type="button"
                >
                  Login
                </button>
                <button
                  className={mode === 'signup' ? 'active' : ''}
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage('');
                  }}
                  type="button"
                >
                  Signup
                </button>
              </div>

              <form className="auth-form" onSubmit={handleAuthSubmit}>
                <label>
                  Username
                  <input
                    name="username"
                    onChange={updateAuthField}
                    placeholder="bright-morning"
                    value={authForm.username}
                  />
                </label>

                <label>
                  Password
                  <input
                    name="password"
                    onChange={updateAuthField}
                    placeholder="at least 6 characters"
                    type="password"
                    value={authForm.password}
                  />
                </label>

                <button className="primary-button" disabled={isBusy} type="submit">
                  {isBusy ? 'Working...' : mode === 'login' ? 'Login' : 'Signup'}
                </button>
              </form>
            </div>
          ) : (
            <div className="dashboard">
              <header className="dashboard-header">
                <div>
                  <p className="eyebrow">Workspace</p>
                  <h2>{user.username}'s lists</h2>
                  <p className="dashboard-subtitle">
                    Keep your important work visible and move tasks forward one list at a time.
                  </p>
                </div>

                <button className="ghost-button" onClick={handleLogout} type="button">
                  Log out
                </button>
              </header>

              <form className="create-list-form" onSubmit={handleCreateList}>
                <input
                  onChange={(event) => setNewListName(event.target.value)}
                  placeholder="Start a new list"
                  value={newListName}
                />
                <button className="primary-button" disabled={isBusy} type="submit">
                  Add list
                </button>
              </form>

              <section className="control-bar">
                <label className="search-field">
                  <span>Search workspace</span>
                  <input
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Find a list or task"
                    value={searchTerm}
                  />
                </label>

                <div className="filter-pills" role="tablist" aria-label="Task filters">
                  {['all', 'active', 'completed'].map((filter) => (
                    <button
                      key={filter}
                      className={viewFilter === filter ? 'active' : ''}
                      onClick={() => setViewFilter(filter)}
                      type="button"
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </section>

              <section className="insight-strip">
                <article>
                  <strong>{lists.length}</strong>
                  <span>Lists in play</span>
                </article>
                <article>
                  <strong>{pendingTodos}</strong>
                  <span>Need action</span>
                </article>
                <article>
                  <strong>{completedTodos}</strong>
                  <span>Finished</span>
                </article>
              </section>

              <section className="workspace-note">
                <strong>Design goal</strong>
                <span>Short lists, clear priorities, and fewer forgotten tasks.</span>
              </section>

              <div className="list-grid">
                {lists.length === 0 ? (
                  <div className="empty-state">
                    <h3>No lists yet</h3>
                    <p>Create your first list and start turning ideas into finished work.</p>
                  </div>
                ) : filteredLists.length === 0 ? (
                  <div className="empty-state">
                    <h3>No matches found</h3>
                    <p>Try a different search or switch the filter to reveal more tasks.</p>
                  </div>
                ) : (
                  filteredLists.map((list) => (
                    <article className="list-card" key={list.id}>
                      <div className="list-card-glow" />
                      {editingListId === list.id ? (
                        <form className="rename-form" onSubmit={(event) => handleRenameList(event, list.id)}>
                          <input
                            autoFocus
                            onChange={(event) => setEditingListName(event.target.value)}
                            value={editingListName}
                          />
                          <div className="inline-actions">
                            <button className="primary-button" disabled={isBusy} type="submit">
                              Save
                            </button>
                            <button
                              className="ghost-button"
                              onClick={() => {
                                setEditingListId(null);
                                setEditingListName('');
                              }}
                              type="button"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="list-card-header">
                          <div>
                            <h3>{list.name}</h3>
                            <p>
                              {(list.todos || []).length} total tasks,{' '}
                              {(list.todos || []).filter((todo) => !todo.completed).length} still open
                            </p>
                          </div>
                          <button
                            className="ghost-button"
                            onClick={() => {
                              setEditingListId(list.id);
                              setEditingListName(list.name);
                            }}
                            type="button"
                          >
                            Rename
                          </button>
                        </div>
                      )}

                      <div className="list-meta">
                        <span className="list-pill">
                          {list.todos.length === 0
                            ? 'No tasks yet'
                            : `${Math.round(
                                ((list.todos || []).filter((todo) => todo.completed).length /
                                  list.todos.length) *
                                  100
                              )}% complete`}
                        </span>
                        <div className="mini-progress">
                          <div
                            className="mini-progress-bar"
                            style={{
                              width: `${
                                list.todos.length === 0
                                  ? 0
                                  : Math.round(
                                      ((list.todos || []).filter((todo) => todo.completed).length /
                                        list.todos.length) *
                                        100
                                    )
                              }%`
                            }}
                          />
                        </div>
                      </div>

                      <form className="todo-form" onSubmit={(event) => handleAddTodo(event, list.id)}>
                        <input
                          onChange={(event) =>
                            setTodoInputs((current) => ({ ...current, [list.id]: event.target.value }))
                          }
                          placeholder="Add a task"
                          value={todoInputs[list.id] || ''}
                        />
                        <button className="primary-button" disabled={isBusy} type="submit">
                          Add
                        </button>
                      </form>

                      <div className="todo-stack">
                        {(list.visibleTodos || []).length === 0 ? (
                          <p className="mini-empty">No matching tasks here yet. Add one above.</p>
                        ) : (
                          (list.visibleTodos || []).map((todo) => (
                            <div className={`todo-item ${todo.completed ? 'done' : ''}`} key={todo.id}>
                              <label>
                                <input
                                  checked={todo.completed}
                                  onChange={() => handleToggleTodo(list.id, todo)}
                                  type="checkbox"
                                />
                                <span title={todo.task}>{todo.task || 'Untitled task'}</span>
                              </label>
                              <div className="todo-actions">
                                <span className={`todo-badge ${todo.completed ? 'complete' : 'active'}`}>
                                  {todo.completed ? 'Done' : 'In progress'}
                                </span>
                                <button
                                  className="danger-button"
                                  onClick={() => handleDeleteTodo(list.id, todo.id)}
                                  type="button"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          )}

          <footer className="status-bar">
            <span>{statusMessage}</span>
            {errorMessage ? <strong>{errorMessage}</strong> : null}
          </footer>
        </section>
      </main>
    </div>
  );
}
