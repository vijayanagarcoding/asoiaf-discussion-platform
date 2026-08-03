const Thread = require("../models/Thread");
const Comment = require("../models/Comment");
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

router.get("/bookmarks", protect, async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .populate({
                path: "bookmarks",
                populate: {
                    path: "user",
                    select: "username"
                }
            });

        res.json(user.bookmarks);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});
router.get("/profile", protect, async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .select("-passwordHash")
            .populate("bookmarks");

        const threads = await Thread.find({
    user: req.user.id
}).sort({ createdAt: -1 });

const commentsCount = await Comment.countDocuments({
    user: req.user.id
});

const likesReceived = threads.reduce(
    (total, thread) => total + thread.likes.length,
    0
);

res.json({

    user,

    threadsCreated: threads.length,

    commentsPosted: commentsCount,

    likesReceived,

    bookmarks: user.bookmarks.length,

    recentThreads: threads.slice(0, 5)

});

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});
module.exports = router;