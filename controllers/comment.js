const Comment = require('../models/comment');

exports.addComment = async (req, res) => {
    const { userId, prodId, content, email } = req.body;
    try {
        const cmt = new Comment({
            userId: userId,
            productId: prodId,
            email: email,
            content: content
        });

        const savedCmt = await cmt.save();
        return res.status(201).json({ message: "ok", savedCmt });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm bình luận!' });
    }
};

exports.getAllComment = async (req, res) => {
    try {
        const comments = await Comment.find();
        return res.status(200).json(comments);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách bình luận!' });
    }
};

exports.getCommentById = async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Không tìm thấy bình luận!' });
        }
        return res.status(200).json(comment);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy bình luận!' });
    }
};

exports.deleteComment = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedComment = await Comment.deleteOne({ _id: id });
        if (deletedComment.deletedCount === 0) {
            return res.status(404).json({ message: 'Không tìm thấy bình luận để xóa!' });
        }
        return res.status(200).json({ message: "ok" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa bình luận!' });
    }
};

// Reply
exports.addReply = async (req, res) => {
    const { cmtId, userId, email, content } = req.body;
    try {
        const newReply = {
            userId: userId,
            email: email,
            content: content
        };

        const updatedComment = await Comment.findByIdAndUpdate(
            cmtId,
            { $push: { replies: newReply } },
            { new: true }
        );

        if (!updatedComment) {
            return res.status(404).json({ message: 'Không tìm thấy bình luận để phản hồi!' });
        }

        return res.status(201).json({ message: "ok", updatedComment });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm phản hồi!' });
    }
};

exports.deleteReply = async (req, res) => {
    const { cmtId, replyId } = req.params;

    try {
        const updatedComment = await Comment.findOneAndUpdate(
            { _id: cmtId },
            { $pull: { replies: { _id: replyId } } },
            { new: true }
        );

        if (!updatedComment) {
            return res.status(404).json({ message: 'Không tìm thấy phản hồi để xóa!' });
        }

        return res.status(200).json({ message: 'ok' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa phản hồi!' });
    }
};