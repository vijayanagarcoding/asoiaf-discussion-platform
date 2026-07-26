const protect = require("../middleware/authMiddleware")
const Comment = require("../models/Comment")
const express = require("express")
const router = express.Router()
const Thread = require("../models/Thread")
const User = require("../models/User");

// Create thread
router.post("/chapters/:chapterId/threads", protect, async (req, res) => {
    try {
        const { title, content, category } = req.body

       const thread = await Thread.create({
    chapterId: req.params.chapterId,
    title,
    content,
    category,
    user: req.user.id
})
        

        res.status(201).json(thread)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})
router.put("/threads/:threadId", protect, async (req, res) => {

    try {

        const thread = await Thread.findById(req.params.threadId);

        if (!thread) {

            return res.status(404).json({
                error: "Thread not found"
            });

        }

        if (thread.user.toString() !== req.user.id) {

            return res.status(403).json({
                error: "Not authorized"
            });

        }

        thread.title = req.body.title;
        thread.content = req.body.content;

        await thread.save();

        res.json(thread);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});
router.delete("/threads/:threadId", protect, async (req, res) => {

    try {

        const thread = await Thread.findById(req.params.threadId);

        if (!thread) {
            return res.status(404).json({
                error: "Thread not found"
            });
        }

        if (thread.user.toString() !== req.user.id) {
            return res.status(403).json({
                error: "Not authorized"
            });
        }

        await Comment.deleteMany({
    threadId: req.params.threadId
});

await Thread.findByIdAndDelete(req.params.threadId);

res.json({
    message: "Thread deleted successfully"
});

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});
// Get threads for chapter
router.get("/chapters/:chapterId/threads", async (req, res) => {
    try {

        const threads = await Thread.find({
    chapterId: req.params.chapterId
})
.populate("user", "username")
.sort({ createdAt: -1 })

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
router.post("/threads/:threadId/like", protect, async (req, res) => {

    try {

        const thread = await Thread.findById(req.params.threadId);

        if (!thread) {
            return res.status(404).json({
                error: "Thread not found"
            });
        }

        const alreadyLiked = thread.likes.includes(req.user.id);

        if (alreadyLiked) {

            thread.likes = thread.likes.filter(
                id => id.toString() !== req.user.id
            );

        } else {

            thread.likes.push(req.user.id);

        }

        await thread.save();

        res.json(thread);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});
router.post("/threads/:threadId/bookmark", protect, async (req, res) => {

    try {

        console.log("User ID:", req.user.id);
        console.log("Thread ID:", req.params.threadId);

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        console.log("Before:", user.bookmarks);

        const alreadyBookmarked = user.bookmarks.some(
            id => id.toString() === req.params.threadId
        );

        if (alreadyBookmarked) {

            user.bookmarks = user.bookmarks.filter(
                id => id.toString() !== req.params.threadId
            );

        } else {

            user.bookmarks.push(req.params.threadId);

        }

        console.log("After Push:", user.bookmarks);

        await user.save();

        console.log("Saved:", user.bookmarks);

        res.json(user);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

});
module.exports = router
