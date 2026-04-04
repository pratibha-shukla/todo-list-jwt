const listService = require('../listService');
const { lists, todos } = require('../../models');

describe('listService', () => {
  beforeEach(() => {
    lists.length = 0;
    todos.length = 0;
  });

  it('creates a list for a user', () => {
    const result = listService.createList('  Weekend  ', 7);

    expect(result).toEqual({
      status: 201,
      data: {
        id: 1,
        name: 'Weekend',
        creatorId: 7,
        todos: []
      }
    });
  });

  it('returns only the current user lists with attached todos', () => {
    listService.createList('Work', 1);
    listService.createList('Home', 2);
    listService.addTodo(1, 'Ship feature', 1);

    const result = listService.getAllLists(1);

    expect(result).toEqual([
      {
        id: 1,
        name: 'Work',
        creatorId: 1,
        todos: [
          {
            id: 1,
            listId: 1,
            task: 'Ship feature',
            completed: false
          }
        ]
      }
    ]);
  });

  it('prevents users from renaming lists they do not own', () => {
    listService.createList('Work', 1);

    const result = listService.updateListName(1, 'Private', 2);

    expect(result).toEqual({
      status: 403,
      message: 'Forbidden'
    });
  });

  it('adds, updates, and deletes todos for the list owner', () => {
    listService.createList('Work', 1);
    const createdTodo = listService.addTodo(1, 'Write tests', 1);
    expect(createdTodo.status).toBe(201);
    expect(createdTodo.data).toMatchObject({
      id: 1,
      listId: 1,
      task: 'Write tests',
      completed: false
    });

    const updatedTodo = listService.updateTodo(1, createdTodo.data.id, { completed: true }, 1);
    const deletedTodo = listService.deleteTodo(1, createdTodo.data.id, 1);

    expect(updatedTodo).toEqual({
      status: 200,
      data: {
        id: 1,
        listId: 1,
        task: 'Write tests',
        completed: true
      }
    });
    expect(deletedTodo).toEqual({
      status: 200,
      data: {
        id: 1,
        listId: 1,
        task: 'Write tests',
        completed: true
      }
    });
    expect(todos).toHaveLength(0);
  });

  it('rejects empty todo text during updates', () => {
    listService.createList('Work', 1);
    listService.addTodo(1, 'Write tests', 1);

    const result = listService.updateTodo(1, 1, { task: '   ' }, 1);

    expect(result).toEqual({
      status: 400,
      message: 'Task is required'
    });
  });
});
