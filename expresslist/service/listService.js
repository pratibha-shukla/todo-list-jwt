const { lists, todos } = require('../models'); // Imports in-memory arrays (mock database)

// Returns the entire array of lists. 
// Note: In a real app, you'd filter this by userId so users don't see everyone's lists!
exports.getAllLists = () => lists;

exports.createList = (name, userId) => {
  const newList = {
     id: lists.length + 1, // Simple ID increment (prone to bugs if items are deleted)
     name: name, 
     creatorId: userId    // Critical: Links the list to the user who created it
    };
  lists.push(newList);
  return newList;
};

exports.updateListName = (listId, name, userId) => {
  // 1. Find the list: parseInt is used because URL params are always strings
  const list = lists.find(l => l.id === parseInt(listId));
  
  if (!list) return { status: 404 }; // Not Found
  
  // 2. Security Check (Authorization): 
  // Ensures ONLY the creator can edit. If IDs don't match, return 403 Forbidden.
  if (list.creatorId !== userId) return { status: 403 };
  
  list.name = name; // Update the memory object
  return { status: 200, data: list };
};

exports.addTodo = (listId, task, userId) => {
  const list = lists.find(l => l.id === parseInt(listId));
  
  if (!list) return { status: 404 };
  
  // 3. Ownership Check: Prevent users from adding tasks to lists they don't own.
  if (list.creatorId !== userId) return { status: 403 };

  const newTodo = { 
    id: todos.length + 1, 
    listId: list.id, 
    task 
  };
  todos.push(newTodo);
  return { status: 201, data: newTodo };
};
