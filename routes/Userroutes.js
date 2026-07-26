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

module.exports = router;