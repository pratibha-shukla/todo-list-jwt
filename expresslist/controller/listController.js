
const listService = require('../service/listService');

exports.getLists = (req, res) => res.json(listService.getAllLists());





// NEW: Controller to delete a list
exports.deleteList = (req, res) => {
  const result = listService.deleteList(req.params.id, req.user.userId);
  res.status(result.status).json(result.data || { message: result.message });
};

// NEW: Controller for admin stats
exports.getAdminStats = (req, res) => {
  const result = listService.getStats();
  res.status(result.status).json(result.data);
};

// exports.getLists = (req, res) => res.json(listService.getAllLists(req.user.userId));





exports.getListById = (req, res) => {
  const result = listService.getListById(req.params.id, req.user.userId);
  // Send the result.data (the list) and the result.status
  res.status(result.status).json(result.data || { message: result.message });
};





exports.postList = (req, res) => {
  const result = listService.createList(req.body.name, req.user.userId);
  res.status(result.status).json(result.data || { message: result.message });
};



exports.patchList = (req, res) => {
  const result = listService.updateListName(req.params.id, req.body.name, req.user.userId);
  res.status(result.status).json(result.data || { message: result.message });
};

exports.postTodo = (req, res) => {
  const result = listService.addTodo(req.params.id, req.body.task, req.user.userId);
  res.status(result.status).json(result.data || { message: result.message });
};

exports.patchTodo = (req, res) => {
  const result = listService.updateTodo(req.params.id, req.params.todoId, req.body, req.user.userId);
  res.status(result.status).json(result.data || { message: result.message });
};

exports.deleteTodo = (req, res) => {
  const result = listService.deleteTodo(req.params.id, req.params.todoId, req.user.userId);
  res.status(result.status).json(result.data || { message: result.message });
};
exports.getAdminStats = (req, res) => {
  const result = listService.getStats();
  res.status(result.status).json(result.data);
};
