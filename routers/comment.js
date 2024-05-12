const express = require('express');

const router = express.Router();
const commentController = require('../controllers/commentController');
const { authToken } = require('../auth/isAuth');

router.get('/:prodId', commentController.getComment);
router.post('/add', authToken, commentController.addComment);
router.delete('/delete/:id', authToken, commentController.deleteComment)

module.exports = router;