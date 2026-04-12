const listService = require('../service/listService');

// 1. Get ONLY the logged-in user's lists (Workspace)
exports.getLists = (req, res) => {
  res.json(listService.getAllLists(req.user.userId));
};

// 2. Get EVERY list in the system (New Nav Link)
exports.getGlobalLists = (req, res) => {
  console.log("Global route hit!"); // <--- Add this
  res.json(listService.getGlobalLists());
};

// 3. Get Admin Statistics (Total counts)
exports.getAdminStats = (req, res) => {
  const result = listService.getStats();
  res.status(result.status).json(result.data);
};

// 4. Delete an entire list
exports.deleteList = (req, res) => {
  const result = listService.deleteList(req.params.id, req.user.userId);
  res.status(result.status).json(result.data || { message: result.message });
};

// 5. Get a specific list by ID
exports.getListById = (req, res) => {
  const result = listService.getListById(req.params.id, req.user.userId);
  res.status(result.status).json(result.data || { message: result.message });
};

// 6. Create a new list
exports.postList = (req, res) => {
  const result = listService.createList(req.body.name, req.user.userId);
  res.status(result.status).json(result.data || { message: result.message });
};

// 7. Update list name
exports.patchList = (req, res) => {
  const result = listService.updateListName(req.params.id, req.body.name, req.user.userId);
  res.status(result.status).json(result.data || { message: result.message });
};

// 8. Add a todo to a list
exports.postTodo = (req, res) => {
  const result = listService.addTodo(req.params.id, req.body.task, req.user.userId);
  res.status(result.status).json(result.data || { message: result.message });
};

// 9. Update a specific todo (task or completed)
exports.patchTodo = (req, res) => {
  const result = listService.updateTodo(req.params.id, req.params.todoId, req.body, req.user.userId);
  res.status(result.status).json(result.data || { message: result.message });
};

// 10. Delete a specific todo
exports.deleteTodo = (req, res) => {
  const result = listService.deleteTodo(req.params.id, req.params.todoId, req.user.userId);
  res.status(result.status).json(result.data || { message: result.message });
};
