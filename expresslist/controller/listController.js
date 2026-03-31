
const listService = require('../service/listService');

exports.getLists = (req, res) => res.json(listService.getAllLists());

exports.postList = (req, res) => {

   const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
  }
  
  const list = listService.createList(name, req.user.userId);
  res.status(201).json(list);
};

exports.patchList = (req, res) => {
  const result = listService.updateListName(req.params.id, req.body.name, req.user.userId);
  res.status(result.status).json(result.data || { message: "Error" });
};

exports.postTodo = (req, res) => {
  const result = listService.addTodo(req.params.id, req.body.task, req.user.userId);
  res.status(result.status).json(result.data || { message: "Error" });
};
