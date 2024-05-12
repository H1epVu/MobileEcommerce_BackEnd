const Comment = require('../models/comment')

exports.addComment = async (req, res) => {
    const { userId, prodId, content, email } = req.body
    try {
        const cmt = new Comment({
            userId: userId,
            productId: prodId,
            email: email,
            content: content
        })

        const savedCmt = await cmt.save()
        return res.status(201).json({ message: "ok", savedCmt })
    } catch (error) {
        console.log(error)
        return res.status(404).json({ message: error })
    }
}

exports.getComment = async (req, res) => {
    const { prodId } = req.params
    try {
        const comments = await Comment.find({ productId: prodId })
        if (comments.length >= 0) {
            return res.status(200).json(comments)
        }
        return res.status(200).json([])
    } catch (error) {
        console.log(error)
        return res.status(404).json({ message: error })
    }
}

exports.getAllComment = async (req, res) => {
    try {
        const comments = await Comment.find()
        if (comments.length >= 0) {
            return res.status(200).json(comments)
        }
        return res.status(200).json([])
    } catch (error) {
        console.log(error)
        return res.status(404).json({ message: error })
    }
}

exports.deleteComment = async (req, res) => {
    const { id } = req.params
    try {
        await Comment.deleteOne({ _id: id })
        res.status(200).json({ message: "ok" })
    } catch (error) {
        return res.status(404).json({ message: error })
    }
}

//Reply
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

        return res.status(201).json({ message: "ok", updatedComment });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Đã xảy ra lỗi khi thêm phản hồi!" });
    }
};

