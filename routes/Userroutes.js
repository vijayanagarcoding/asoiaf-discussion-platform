const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Thread = require("../models/Thread");
const Comment = require("../models/Comment");

const protect = require("../middleware/authMiddleware");

// =======================
// Get Bookmarks
// =======================
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

// =======================
// Get Profile
// =======================
router.get("/profile", protect, async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .select("-passwordHash")
            .populate("bookmarks");

        const threadCount = await Thread.countDocuments({
            user: req.user.id
        });

        const commentCount = await Comment.countDocuments({
            user: req.user.id
        });

        const threads = await Thread.find({
            user: req.user.id
        });
const categoryCount = {};

threads.forEach(thread => {

    categoryCount[thread.category] =
        (categoryCount[thread.category] || 0) + 1;

});

let favouriteCategory = "None";

let max = 0;

for (const category in categoryCount) {

    if (categoryCount[category] > max) {

        max = categoryCount[category];

        favouriteCategory = category;

    }

}
        let likesReceived = 0;

        threads.forEach(thread => {
            likesReceived += thread.likes.length;
        });

        const recentThreads = await Thread.find({
    user: req.user.id
})
.sort({ createdAt: -1 })
.limit(5);

res.json({

    user,

    stats: {

    threadCount,

    commentCount,

    likesReceived,

    bookmarkCount: user.bookmarks.length,

    favouriteCategory

},

    recentThreads

});

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

module.exports = router;