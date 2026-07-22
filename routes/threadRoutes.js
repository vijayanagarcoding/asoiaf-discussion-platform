const Comment = require("../models/Comment")
const express = require("express")
const router = express.Router()
const Thread = require("../models/Thread")
// Create thread
router.post("/chapters/:chapterId/threads", async (req, res) => {
    try {
        const { title, content, category } = req.body

       const thread = await Thread.create({
    chapterId: req.params.chapterId,
    title,
    content,
    category
})
        

        res.status(201).json(thread)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Get threads for chapter
router.get("/chapters/:chapterId/threads", async (req, res) => {
    try {

        const threads = await Thread.find({
            chapterId: req.params.chapterId
        }).sort({ createdAt: -1 })

        const threadsWithCounts = await Promise.all(

            threads.map(async (thread) => {

                const commentCount = await Comment.countDocuments({
                    threadId: thread._id
                })

                return {
                    ...thread.toObject(),
                    commentCount
                }
            })

        )

        res.json(threadsWithCounts)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router
