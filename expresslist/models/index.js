const users = [];
const lists = [];
const todos = [];
// users: { id, username, password, refreshTokens: [] }
// lists: { id, name, creatorId }
// todos: { id, listId, task, completed }

module.exports = { users, lists, todos };
