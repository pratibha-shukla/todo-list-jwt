

// routes/list.js
const express = require('express');
const router = express.Router();
const listCtrl = require('../controller/listController'); // Fix path here
const guard = require('../middleware/auth');

router.get('/', guard, listCtrl.getLists);
router.get('/:id', guard, listCtrl.getListById);

router.post('/', guard, listCtrl.postList);
router.patch('/:id', guard, listCtrl.patchList);
router.post('/:id/todos', guard, listCtrl.postTodo);
router.patch('/:id/todos/:todoId', guard, listCtrl.patchTodo);
router.delete('/:id/todos/:todoId', guard, listCtrl.deleteTodo);

module.exports = router;


