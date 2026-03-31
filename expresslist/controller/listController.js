
const listService = require('../service/listService');

// Fetch all lists: Simply calls the service and sends back the array as JSON.
exports.getLists = (req, res) => res.json(listService.getAllLists());


// Create a new list: 
exports.postList = (req, res) => {

   const { name } = req.body;


    // Manual Validation: Ensure the user actually sent a name.
    if (!name) {

          // 400 Bad Request: Stops execution so we don't save an empty list.
      return res.status(400).json({ message: "Name is required" });
  }
  
    // Logic: Passes the name and the logged-in User's ID (from middleware) to the 
  const list = listService.createList(name, req.user.userId);

  
  // 201 Created: Success status for resource creation. Returns the new list as JSON.
  res.status(201).json(list);
};


// Rename a list:
exports.patchList = (req, res) => {

   // Pass ID from URL params, name from Body, and UserID for ownership verification.
  const result = listService.updateListName(req.params.id, req.body.name, req.user.userId);

  // Dynamic status: The service likely returns { status: 200, data: ... } or { status: 404 }.
  res.status(result.status).json(result.data || { message: "Error" });
};

// Add a task to a list:
exports.postTodo = (req, res) => {

   // Uses req.params.id to know WHICH list to add the task to.
  const result = listService.addTodo(req.params.id, req.body.task, req.user.userId);
  res.status(result.status).json(result.data || { message: "Error" });
};
