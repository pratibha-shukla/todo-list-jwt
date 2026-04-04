const { lists, todos } = require('../models');

const toListWithTodos = (list) => ({
  ...list,
  todos: todos.filter((todo) => todo.listId === list.id)
});

exports.getAllLists = (userId) => lists
  .filter((list) => list.creatorId === userId)
  .map(toListWithTodos);

exports.createList = (name, userId) => {
  const trimmedName = String(name || '').trim();

  if (!trimmedName) {
    return { status: 400, message: 'List name is required' };
  }

  const newList = {
    id: lists.length + 1,
    name: trimmedName,
    creatorId: userId
  };
  lists.push(newList);
  return { status: 201, data: toListWithTodos(newList) };
};

exports.updateListName = (listId, name, userId) => {
  const list = lists.find(l => l.id === parseInt(listId));
  const trimmedName = String(name || '').trim();

  if (!list) return { status: 404, message: 'List not found' };
  if (list.creatorId !== userId) return { status: 403, message: 'Forbidden' };
  if (!trimmedName) return { status: 400, message: 'List name is required' };

  list.name = trimmedName;
  return { status: 200, data: toListWithTodos(list) };
};

exports.addTodo = (listId, task, userId) => {
  const list = lists.find(l => l.id === parseInt(listId));
  const trimmedTask = String(task || '').trim();

  if (!list) return { status: 404, message: 'List not found' };
  if (list.creatorId !== userId) return { status: 403, message: 'Forbidden' };
  if (!trimmedTask) return { status: 400, message: 'Task is required' };

  const newTodo = { 
    id: todos.length + 1, 
    listId: list.id, 
    task: trimmedTask,
    completed: false
  };
  todos.push(newTodo);
  return { status: 201, data: newTodo };
};

exports.updateTodo = (listId, todoId, updates, userId) => {
  const list = lists.find((existingList) => existingList.id === parseInt(listId));

  if (!list) return { status: 404, message: 'List not found' };
  if (list.creatorId !== userId) return { status: 403, message: 'Forbidden' };

  const todo = todos.find(
    (existingTodo) => existingTodo.id === parseInt(todoId) && existingTodo.listId === list.id
  );

  if (!todo) return { status: 404, message: 'Todo not found' };

  if (Object.prototype.hasOwnProperty.call(updates, 'task')) {
    const trimmedTask = String(updates.task || '').trim();

    if (!trimmedTask) {
      return { status: 400, message: 'Task is required' };
    }

    todo.task = trimmedTask;
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'completed')) {
    todo.completed = Boolean(updates.completed);
  }

  return { status: 200, data: todo };
};

exports.deleteTodo = (listId, todoId, userId) => {
  const list = lists.find((existingList) => existingList.id === parseInt(listId));

  if (!list) return { status: 404, message: 'List not found' };
  if (list.creatorId !== userId) return { status: 403, message: 'Forbidden' };

  const todoIndex = todos.findIndex(
    (todo) => todo.id === parseInt(todoId) && todo.listId === list.id
  );

  if (todoIndex === -1) return { status: 404, message: 'Todo not found' };

  const [deletedTodo] = todos.splice(todoIndex, 1);
  return { status: 200, data: deletedTodo };
};
