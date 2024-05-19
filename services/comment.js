const Comment = require('../models/comment')

exports.getProductComment = async (req, res) => {
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