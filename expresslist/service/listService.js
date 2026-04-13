const { lists, todos, users } = require('../models');

// 1. HELPER: Attaches todos to a list with clean property names
const toListWithTodos = (list) => ({
  listId: list.id,
  listName: list.name,
  creatorId: list.creatorId,
  todos: todos
    .filter((todo) => todo.listId === list.id)
    .map(todo => ({
      todoId: todo.id,
      task: todo.task,
      completed: todo.completed
    }))
});

// 2. USER WORKSPACE: Shows only the logged-in user's lists
exports.getAllLists = (userId) => {
  return lists
    .filter((list) => list.creatorId == userId)
    .map(toListWithTodos);
};

// 3. GLOBAL VIEW: Returns every list in the system for your Nav Link
exports.getGlobalLists = () => {
  return lists.map(toListWithTodos);
};

// 4. STATS: Returns global counts
exports.getStats = () => {
  return {
    status: 200,
    data: {
      totalUsers: users.length,
      totalLists: lists.length,
      totalTodos: todos.length
    }
  };
};

// 5. DELETE LIST: Removes list and its specific todos
exports.deleteList = (listId, userId) => {
  const index = lists.findIndex(l => l.id === parseInt(listId));
  if (index === -1) return { status: 404, message: 'List not found' };
  
  // Security check: Only owner can delete
  if (lists[index].creatorId != userId) return { status: 403, message: 'Forbidden' };

  lists.splice(index, 1);
  for (let i = todos.length - 1; i >= 0; i--) {
    if (todos[i].listId === parseInt(listId)) todos.splice(i, 1);
  }
  return { status: 200, message: 'List deleted successfully' };
};

exports.getListById = (listId, userId) => {
  // 1. First, find the list by its ID only to see if it exists at all
  const list = lists.find(l => l.id == listId);
  
  if (!list) {
    return { status: 404, message: "List not found" };
  }
  
  // 2. Then, check if the logged-in user has permission to see it
  // Using != (loose inequality) is safer for ID type mismatches
  if (list.creatorId != userId) {
    console.log(`Access Denied: List owner is ${list.creatorId}, but requester is ${userId}`);
    return { status: 403, message: "Forbidden: You do not own this list" };
  }
  
  // 3. If everything is okay, return the list with its todos
  return { status: 200, data: toListWithTodos(list) };
};


// 7. CREATE LIST
exports.createList = (name, userId) => {
  const trimmedName = String(name || '').trim();
  if (!trimmedName) return { status: 400, message: 'List name is required' };

  const newList = {
    id: lists.length > 0 ? Math.max(...lists.map(l => l.id)) + 1 : 1,
    name: trimmedName,
    creatorId: userId
  };
  lists.push(newList);
  return { status: 201, data: toListWithTodos(newList) };
};

// 8. UPDATE LIST NAME
exports.updateListName = (listId, name, userId) => {
  const list = lists.find(l => l.id === parseInt(listId));
  const trimmedName = String(name || '').trim();

  if (!list) return { status: 404, message: 'List not found' };
  if (list.creatorId != userId) return { status: 403, message: 'Forbidden' };
  if (!trimmedName) return { status: 400, message: 'List name is required' };

  list.name = trimmedName;
  return { status: 200, data: toListWithTodos(list) };
};

// 9. ADD TODO
exports.addTodo = (listId, task, userId) => {
  const list = lists.find(l => l.id === parseInt(listId));
  const trimmedTask = String(task || '').trim();

  if (!list) return { status: 404, message: 'List not found' };
  if (list.creatorId != userId) return { status: 403, message: 'Forbidden' };
  if (!trimmedTask) return { status: 400, message: 'Task is required' };

  const newTodo = { 
    id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1, 
    listId: list.id, 
    task: trimmedTask,
    completed: false
  };
  todos.push(newTodo);
  return {
    status: 201,
    data: {
      todoId: newTodo.id,
      task: newTodo.task,
      completed: newTodo.completed
    }
  };
};

// 10. UPDATE TODO
exports.updateTodo = (listId, todoId, updates, userId) => {
  const list = lists.find(l => l.id == listId);
  if (!list) return { status: 404, message: 'List not found' };
  if (list.creatorId != userId) return { status: 403, message: 'Forbidden' };

  const todo = todos.find(t => t.id == todoId && t.listId == list.id);
  if (!todo) return { status: 404, message: 'Todo not found' };

  // Update logic
  if (updates.hasOwnProperty('task')) {
    todo.task = String(updates.task).trim();
  }
  if (updates.hasOwnProperty('completed')) {
    todo.completed = Boolean(updates.completed);
  }

  // FIX: Return the object using the key 'todoId'
  return { 
    status: 200, 
    data: {
      todoId: todo.id, // Use todoId here!
      task: todo.task,
      completed: todo.completed
    } 
  };
};


// 11. DELETE TODO
exports.deleteTodo = (listId, todoId, userId) => {
  const list = lists.find(l => l.id === parseInt(listId));
  if (!list) return { status: 404, message: 'List not found' };
  if (list.creatorId != userId) return { status: 403, message: 'Forbidden' };

  const index = todos.findIndex(t => t.id === parseInt(todoId) && t.listId === list.id);
  if (index === -1) return { status: 404, message: 'Todo not found' };

  const [deletedTodo] = todos.splice(index, 1);
  return {
    status: 200,
    data: {
      todoId: deletedTodo.id,
      task: deletedTodo.task,
      completed: deletedTodo.completed
    }
  };
};

