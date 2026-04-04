const request = require('supertest');
const app = require('../../app');
const { users, lists, todos } = require('../models');

describe('JWT todo API integration', () => {
  beforeEach(() => {
    users.length = 0;
    lists.length = 0;
    todos.length = 0;
  });

  it('supports signup, login, profile lookup, list creation, and todo lifecycle', async () => {
    const signupResponse = await request(app)
      .post('/auth/signup')
      .send({ username: 'alice', password: 'secret1' });

    expect(signupResponse.status).toBe(201);
    expect(signupResponse.body).toEqual({
      id: 1,
      username: 'alice'
    });

    const agent = request.agent(app);
    const loginResponse = await agent
      .post('/auth/login')
      .send({ username: 'alice', password: 'secret1' });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toEqual({
      message: 'Logged in successfully',
      user: {
        id: 1,
        username: 'alice'
      }
    });
    expect(loginResponse.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('token=')])
    );

    const meResponse = await agent.get('/auth/me');
    expect(meResponse.status).toBe(200);
    expect(meResponse.body).toMatchObject({
      userId: 1,
      username: 'alice',
      role: 'user'
    });

    const createListResponse = await agent
      .post('/lists')
      .send({ name: 'Weekend' });
    expect(createListResponse.status).toBe(201);
    expect(createListResponse.body).toEqual({
      id: 1,
      name: 'Weekend',
      creatorId: 1,
      todos: []
    });

    const createTodoResponse = await agent
      .post('/lists/1/todos')
      .send({ task: 'Buy milk' });
    expect(createTodoResponse.status).toBe(201);
    expect(createTodoResponse.body).toEqual({
      id: 1,
      listId: 1,
      task: 'Buy milk',
      completed: false
    });

    const updateTodoResponse = await agent
      .patch('/lists/1/todos/1')
      .send({ completed: true });
    expect(updateTodoResponse.status).toBe(200);
    expect(updateTodoResponse.body).toEqual({
      id: 1,
      listId: 1,
      task: 'Buy milk',
      completed: true
    });

    const getListsResponse = await agent.get('/lists');
    expect(getListsResponse.status).toBe(200);
    expect(getListsResponse.body).toEqual([
      {
        id: 1,
        name: 'Weekend',
        creatorId: 1,
        todos: [
          {
            id: 1,
            listId: 1,
            task: 'Buy milk',
            completed: true
          }
        ]
      }
    ]);

    const deleteTodoResponse = await agent.delete('/lists/1/todos/1');
    expect(deleteTodoResponse.status).toBe(200);
    expect(deleteTodoResponse.body).toEqual({
      id: 1,
      listId: 1,
      task: 'Buy milk',
      completed: true
    });
  });

  it('rejects protected routes when no token is present', async () => {
    const response = await request(app).get('/lists');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Authentication required'
    });
  });

  it('isolates list data between users', async () => {
    const alice = request.agent(app);
    const bob = request.agent(app);

    await alice.post('/auth/signup').send({ username: 'alice', password: 'secret1' });
    await bob.post('/auth/signup').send({ username: 'bob', password: 'secret1' });

    await alice.post('/auth/login').send({ username: 'alice', password: 'secret1' });
    await bob.post('/auth/login').send({ username: 'bob', password: 'secret1' });

    await alice.post('/lists').send({ name: 'Alice list' });
    await bob.post('/lists').send({ name: 'Bob list' });

    const aliceLists = await alice.get('/lists');
    const bobLists = await bob.get('/lists');

    expect(aliceLists.body).toEqual([
      {
        id: 1,
        name: 'Alice list',
        creatorId: 1,
        todos: []
      }
    ]);
    expect(bobLists.body).toEqual([
      {
        id: 2,
        name: 'Bob list',
        creatorId: 2,
        todos: []
      }
    ]);
  });

  it('clears authentication on logout', async () => {
    const agent = request.agent(app);

    await agent.post('/auth/signup').send({ username: 'alice', password: 'secret1' });
    await agent.post('/auth/login').send({ username: 'alice', password: 'secret1' });

    const logoutResponse = await agent.post('/auth/logout');
    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.body).toEqual({
      message: 'Logged out successfully'
    });

    const meResponse = await agent.get('/auth/me');
    expect(meResponse.status).toBe(401);
  });
});
