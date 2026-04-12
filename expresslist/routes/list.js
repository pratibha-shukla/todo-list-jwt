

// routes/list.js
const express = require('express');
const router = express.Router();
const listCtrl = require('../controller/listController'); // Fix path here
const guard = require('../middleware/auth');


// 1. Static routes go FIRST
router.get('/', guard, listCtrl.getLists);
router.get('/stats', guard, listCtrl.getAdminStats); // Gets user/list counts
router.get('/global', guard, listCtrl.getGlobalLists);


// 2. Dynamic ID routes go LAST to avoid conflicts

router.get('/:id', guard, listCtrl.getListById);
router.delete('/:id', guard, listCtrl.deleteList); // Deletes a list
router.post('/', guard, listCtrl.postList);
router.patch('/:id', guard, listCtrl.patchList);

// Todo routes
router.post('/:id/todos', guard, listCtrl.postTodo);
router.patch('/:id/todos/:todoId', guard, listCtrl.patchTodo);
router.delete('/:id/todos/:todoId', guard, listCtrl.deleteTodo);

module.exports = router;


