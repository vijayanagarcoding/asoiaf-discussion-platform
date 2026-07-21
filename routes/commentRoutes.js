const express = require("express")
const router = express.Router()
const Comment = require("../models/Comment")

// Temporary browser-safe create route
router.get("/test-comment/:threadId", async (req, res) => {
    try {
        const comment = await Comment.create({
            threadId: req.params.threadId,
            content: "Manual test comment from browser."
        })

        res.json(comment)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})
// Create comment
router.post("/threads/:threadId/comments", async (req, res) => {
    try {
        const { content } = req.body

        const comment = await Comment.create({
            threadId: req.params.threadId,
            content
        })

        res.status(201).json(comment)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})
// Get comments for thread
router.get("/threads/:threadId/comments", async (req, res) => {
    try {
        const comments = await Comment.find({
            threadId: req.params.threadId
        }).sort({ createdAt: 1 })

        res.json(comments)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router