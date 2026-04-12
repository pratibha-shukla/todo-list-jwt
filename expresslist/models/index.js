
const lists = [];
const todos = [];
const users = [];
// users: { id, username, password, refreshTokens: [] }
// lists: { id, name, creatorId }
// todos: { id, listId, task, completed }

module.exports = { users, lists, todos };
