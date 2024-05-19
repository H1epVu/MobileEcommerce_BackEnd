const express = require('express');

const router = express.Router();
const commentController = require('../controllers/comment');
const commentService = require('../services/comment')
const { authToken } = require('../auth/isAuth');


router.post('/add', authToken, commentController.addComment);
router.delete('/delete/:id', authToken, commentController.deleteComment)
router.post('/reply/add', commentController.addReply);
router.delete('/delete/:cmtId/:replyId', commentController.deleteReply)
router.get('/prod/:prodId', commentService.getProductComment);
router.get('/:id', commentController.getCommentById);
router.get('/', commentController.getAllComment);

module.exports = router;