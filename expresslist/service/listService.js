const { lists, todos } = require('../models');

exports.getAllLists = () => lists;

exports.createList = (name, userId) => {
  const newList = {
     id: lists.length + 1, 
     name: name, 
     creatorId: userId 
    };
  lists.push(newList);
  return newList;
};

exports.updateListName = (listId, name, userId) => {
  const list = lists.find(l => l.id === parseInt(listId));
  if (!list) return { status: 404 };
  if (list.creatorId !== userId) return { status: 403 };
  
  list.name = name;
  return { status: 200, data: list };
};

exports.addTodo = (listId, task, userId) => {
  const list = lists.find(l => l.id === parseInt(listId));
  if (!list) return { status: 404 };
  if (list.creatorId !== userId) return { status: 403 };

  const newTodo = { id: todos.length + 1, listId: list.id, task };
  todos.push(newTodo);
  return { status: 201, data: newTodo };
};
