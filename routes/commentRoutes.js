const express = require("express")
const router = express.Router()
const Comment = require("../models/Comment")
const protect = require("../middleware/authMiddleware")

// Temporary browser-safe create route
router.get("/test-comment/:threadId", protect, async (req, res) => {
    try {
        const comment = await Comment.create({
    threadId: req.params.threadId,
    content,
    user: req.user.id
        })

        res.json(comment)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})
// Create comment
router.post("/threads/:threadId/comments",protect, async (req, res) => {
    try {
        const { content } = req.body

        const comment = await Comment.create({
            threadId: req.params.threadId,
            content,
            user: req.user.id
        })

        res.status(201).json(comment)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})
router.put("/comments/:commentId", protect, async (req, res) => {

    try {

        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {

            return res.status(404).json({
                error: "Comment not found"
            });

        }

        if (comment.user.toString() !== req.user.id) {

            return res.status(403).json({
                error: "Not authorized"
            });

        }

        comment.content = req.body.content;

        await comment.save();

        res.json(comment);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
router.delete("/comments/:commentId", protect, async (req, res) => {

    try {

        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {

            return res.status(404).json({
                error: "Comment not found"
            });

        }

        if (comment.user.toString() !== req.user.id) {

            return res.status(403).json({
                error: "Not authorized"
            });

        }

        await Comment.findByIdAndDelete(req.params.commentId);

        res.json({
            message: "Comment deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});
});
// Get comments for thread
router.get("/threads/:threadId/comments", async (req, res) => {
    try {
        const comments = await Comment.find({
            threadId: req.params.threadId
        })
        .populate("user", "username avatar")
        .sort({ createdAt: 1 })

        res.json(comments)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})
module.exports = router